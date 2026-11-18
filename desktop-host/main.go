package main

import (
	"archive/zip"
	"bytes"
	"embed"
	"encoding/base64"
	"encoding/json"
	"io"
	"io/fs"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
	"unsafe"

	"github.com/jchv/go-webview2"
	"golang.org/x/sys/windows"
)

//go:embed all:www
var content embed.FS

func main() {
	root, err := fs.Sub(content, "www")
	if err != nil {
		alert("Cardwright could not read its own files.")
		return
	}

	listener, err := listenLocal()
	if err != nil {
		alert("Cardwright could not open a local port.")
		return
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/__cardwright", desktopFlag)
	mux.HandleFunc("/api/cardwright", desktopFlag)
	mux.HandleFunc("/proxy/", proxyKobold)
	mux.HandleFunc("/api/novelai", proxyNovel)
	mux.HandleFunc("/__save-png", savePng)
	mux.HandleFunc("/__downloads", downloadsInfo)
	mux.HandleFunc("/__downloads/choose", downloadsChoose)
	mux.HandleFunc("/__downloads/file", downloadsFile)
	mux.HandleFunc("/__pick-card", pickCard)
	mux.HandleFunc("/__vault/info", vaultInfo)
	mux.HandleFunc("/__vault/choose", vaultChoose)
	mux.HandleFunc("/__vault/entries", vaultEntries)
	mux.HandleFunc("/__vault/entry", vaultEntry)
	mux.HandleFunc("/__app-settings", appSettings)
	mux.HandleFunc("/__app-settings/save-as", saveSettingsAs)
	mux.HandleFunc("/__app-settings/open", openSettings)
	mux.HandleFunc("/__quit", quitApp)
	mux.Handle("/", http.FileServer(http.FS(root)))

	go func() {
		_ = http.Serve(listener, mux)
	}()

	origin := "http://" + listener.Addr().String()
	if !waitReady(origin) {
		alert("Cardwright started, but its window never came up.")
		return
	}

	window := webview2.NewWithOptions(webview2.WebViewOptions{
		Debug:     false,
		AutoFocus: true,
		DataPath:  cacheDir(),
		WindowOptions: webview2.WindowOptions{
			Title:  "Cardwright",
			Width:  1280,
			Height: 900,
			Center: true,
		},
	})
	if window == nil {
		alert("Cardwright needs the Microsoft Edge WebView2 runtime, which Windows 11 already includes. Install WebView2, then open Cardwright again.")
		return
	}
	defer window.Destroy()
	appWindow = window
	window.Navigate(origin + "/")
	window.Run()
}

var appWindow webview2.WebView

func listenLocal() (net.Listener, error) {
	if listener, err := net.Listen("tcp", "127.0.0.1:47331"); err == nil {
		return listener, nil
	}
	return net.Listen("tcp", "127.0.0.1:0")
}

func settingsAutoPath() string {
	base, err := os.UserConfigDir()
	if err != nil || base == "" {
		base, err = os.UserCacheDir()
		if err != nil || base == "" {
			base = os.TempDir()
		}
	}
	dir := filepath.Join(base, "Cardwright")
	_ = os.MkdirAll(dir, 0o755)
	return filepath.Join(dir, "settings.json")
}

func desktopFlag(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(`{"desktop":true}`))
}

func cacheDir() string {
	base, err := os.UserCacheDir()
	if err != nil || base == "" {
		base = os.TempDir()
	}
	dir := filepath.Join(base, "Cardwright")
	_ = os.MkdirAll(dir, 0o755)
	return dir
}

func waitReady(origin string) bool {
	deadline := time.Now().Add(3 * time.Second)
	for time.Now().Before(deadline) {
		resp, err := http.Get(origin + "/__cardwright")
		if err == nil {
			_, _ = io.Copy(io.Discard, resp.Body)
			_ = resp.Body.Close()
			if resp.StatusCode == http.StatusOK {
				return true
			}
		}
		time.Sleep(30 * time.Millisecond)
	}
	return false
}

func proxyNovel(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	token := strings.TrimSpace(strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer "))
	if len(token) < 8 {
		http.Error(w, `{"message":"Add your NovelAI persistent token."}`, http.StatusUnauthorized)
		return
	}
	body, err := io.ReadAll(io.LimitReader(r.Body, 8<<20))
	if err != nil {
		http.Error(w, `{"message":"Could not read the draw request."}`, http.StatusBadRequest)
		return
	}
	req, err := http.NewRequestWithContext(r.Context(), http.MethodPost, "https://image.novelai.net/ai/generate-image", strings.NewReader(string(body)))
	if err != nil {
		http.Error(w, `{"message":"Could not reach NovelAI."}`, http.StatusBadGateway)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	client := &http.Client{Timeout: 190 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, `{"message":"Could not reach NovelAI."}`, http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()
	payload, err := io.ReadAll(io.LimitReader(resp.Body, 20<<20))
	if err != nil {
		http.Error(w, `{"message":"The picture download from NovelAI was interrupted."}`, http.StatusBadGateway)
		return
	}
	if resp.StatusCode != http.StatusOK {
		if contentType := resp.Header.Get("Content-Type"); contentType != "" {
			w.Header().Set("Content-Type", contentType)
		}
		w.WriteHeader(resp.StatusCode)
		_, _ = w.Write(payload)
		return
	}
	png, ok := pngFromNovel(payload)
	if !ok {
		http.Error(w, `{"message":"NovelAI did not return a picture."}`, http.StatusBadGateway)
		return
	}
	w.Header().Set("Content-Type", "image/png")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(png)
}

func pngFromNovel(body []byte) ([]byte, bool) {
	if len(body) >= 8 && body[0] == 0x89 && body[1] == 'P' {
		return body, true
	}
	reader, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	if err != nil {
		return nil, false
	}
	for _, file := range reader.File {
		if !strings.HasSuffix(strings.ToLower(file.Name), ".png") {
			continue
		}
		opened, err := file.Open()
		if err != nil {
			continue
		}
		data, err := io.ReadAll(io.LimitReader(opened, 20<<20))
		_ = opened.Close()
		if err == nil && len(data) >= 8 && data[0] == 0x89 {
			return data, true
		}
	}
	return nil, false
}

func proxyKobold(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodPost && r.Method != http.MethodOptions {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	base := strings.TrimSpace(r.Header.Get("X-Kobold-Base"))
	parsed, err := url.Parse(base)
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") || parsed.Host == "" {
		http.Error(w, "Kobold address is not a URL.", http.StatusBadRequest)
		return
	}
	host := parsed.Hostname()
	if host != "127.0.0.1" && !strings.EqualFold(host, "localhost") && host != "::1" {
		http.Error(w, "Cardwright only forwards to a model on this computer.", http.StatusForbidden)
		return
	}

	suffix := strings.TrimPrefix(r.URL.Path, "/proxy/")
	if suffix != "chat/completions" && suffix != "models" {
		http.Error(w, "unknown", http.StatusNotFound)
		return
	}

	target := strings.TrimRight(parsed.String(), "/") + "/" + suffix
	req, err := http.NewRequestWithContext(r.Context(), r.Method, target, r.Body)
	if err != nil {
		http.Error(w, "could not reach KoboldCPP", http.StatusBadGateway)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	if auth := r.Header.Get("Authorization"); auth != "" {
		req.Header.Set("Authorization", auth)
	}

	client := &http.Client{Timeout: 190 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Could not reach KoboldCPP. Start it, then check the address.", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	if contentType := resp.Header.Get("Content-Type"); contentType != "" {
		w.Header().Set("Content-Type", contentType)
	}
	w.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(w, resp.Body)
}

func savePng(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	body, err := io.ReadAll(io.LimitReader(r.Body, 30<<20))
	if err != nil || len(body) < 8 || body[0] != 0x89 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "That file is not a PNG."})
		return
	}
	path, ok := pickPath(true, safePngName(r.Header.Get("X-Filename")), "Save image", "PNG image", "*.png", "png")
	if !ok {
		writeJSON(w, http.StatusOK, map[string]bool{"cancelled": true})
		return
	}
	if err := os.WriteFile(path, body, 0o644); err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"message": "Could not write that file."})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"path": path})
}

func appSettings(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		data, err := os.ReadFile(settingsAutoPath())
		if err != nil {
			writeJSON(w, http.StatusOK, map[string]bool{"empty": true})
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write(data)
	case http.MethodPut:
		body, err := io.ReadAll(io.LimitReader(r.Body, 8<<20))
		if err != nil || !json.Valid(body) {
			writeJSON(w, http.StatusBadRequest, map[string]string{"message": "Settings were not valid."})
			return
		}
		if err := os.WriteFile(settingsAutoPath(), body, 0o600); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Could not store settings."})
			return
		}
		w.WriteHeader(http.StatusNoContent)
	default:
		http.Error(w, "method", http.StatusMethodNotAllowed)
	}
}

func saveSettingsAs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	body, err := io.ReadAll(io.LimitReader(r.Body, 8<<20))
	if err != nil || !json.Valid(body) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "Settings were not valid."})
		return
	}
	path, ok := pickPath(true, "cardwright-settings.json", "Save settings", "Cardwright settings", "*.json", "json")
	if !ok {
		writeJSON(w, http.StatusOK, map[string]bool{"cancelled": true})
		return
	}
	if err := os.WriteFile(path, body, 0o600); err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"message": "Could not write that file."})
		return
	}
	_ = os.WriteFile(settingsAutoPath(), body, 0o600)
	writeJSON(w, http.StatusOK, map[string]string{"path": path})
}

func openSettings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	path, ok := pickPath(false, "cardwright-settings.json", "Load settings", "Cardwright settings", "*.json", "json")
	if !ok {
		writeJSON(w, http.StatusOK, map[string]bool{"cancelled": true})
		return
	}
	data, err := os.ReadFile(path)
	if err != nil || !json.Valid(data) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "That file is not a Cardwright settings file."})
		return
	}
	var file any
	if err := json.Unmarshal(data, &file); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "That file is not a Cardwright settings file."})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"file": file})
}

func pickCard(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	path, ok := pickPath(false, "card.json", "Import a character card", "Character card", "*.json;*.png", "json")
	if !ok {
		writeJSON(w, http.StatusOK, map[string]bool{"cancelled": true})
		return
	}
	file, err := os.Open(path)
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"message": "Could not read that file."})
		return
	}
	defer file.Close()
	data, err := io.ReadAll(io.LimitReader(file, 32<<20+1))
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"message": "Could not read that file."})
		return
	}
	if len(data) > 32<<20 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "That card is larger than 32 MB."})
		return
	}
	name := filepath.Base(path)
	kind := "application/json"
	if strings.HasSuffix(strings.ToLower(name), ".png") {
		kind = "image/png"
	}
	writeJSON(w, http.StatusOK, map[string]string{
		"name": name,
		"type": kind,
		"data": base64.StdEncoding.EncodeToString(data),
	})
}

func quitApp(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	w.WriteHeader(http.StatusNoContent)
	if appWindow != nil {
		appWindow.Dispatch(func() { appWindow.Terminate() })
	}
}

var (
	vaultMu   sync.Mutex
	vaultRoot string
)

func vaultPathFile() string {
	return filepath.Join(filepath.Dir(settingsAutoPath()), "library-path.txt")
}

func knownBucket(name string) bool {
	switch name {
	case "cards", "personas", "presets", "media", "gallery", "lore", "world", "chats":
		return true
	default:
		return false
	}
}

func safeRecordID(id string) (string, bool) {
	if id == "" || len(id) > 120 || id == "." || id == ".." {
		return "", false
	}
	for _, r := range id {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '-' || r == '_' || r == '.' {
			continue
		}
		return "", false
	}
	return id, true
}

func setVaultRoot(path string) error {
	cleaned := filepath.Clean(path)
	if err := os.MkdirAll(cleaned, 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(vaultPathFile(), []byte(cleaned), 0o600); err != nil {
		return err
	}
	vaultMu.Lock()
	vaultRoot = cleaned
	vaultMu.Unlock()
	return nil
}

func ensureVault() (string, error) {
	vaultMu.Lock()
	current := vaultRoot
	vaultMu.Unlock()
	if current != "" {
		if err := os.MkdirAll(current, 0o755); err != nil {
			return "", err
		}
		return current, nil
	}
	data, err := os.ReadFile(vaultPathFile())
	if err == nil {
		saved := strings.TrimSpace(string(data))
		if saved != "" {
			if err := setVaultRoot(saved); err != nil {
				return "", err
			}
			return filepath.Clean(saved), nil
		}
	}
	dir := filepath.Join(filepath.Dir(settingsAutoPath()), "Library")
	if err := setVaultRoot(dir); err != nil {
		return "", err
	}
	return dir, nil
}

func sameFolder(a, b string) bool {
	return strings.EqualFold(filepath.Clean(a), filepath.Clean(b))
}

func copyVault(from, to string) {
	if from == "" || to == "" || sameFolder(from, to) {
		return
	}
	for _, bucket := range []string{"cards", "personas", "presets", "media", "gallery", "lore", "world", "chats"} {
		srcDir := filepath.Join(from, bucket)
		entries, err := os.ReadDir(srcDir)
		if err != nil {
			continue
		}
		dstDir := filepath.Join(to, bucket)
		_ = os.MkdirAll(dstDir, 0o755)
		for _, entry := range entries {
			if entry.IsDir() || !strings.HasSuffix(strings.ToLower(entry.Name()), ".json") {
				continue
			}
			target := filepath.Join(dstDir, entry.Name())
			if _, err := os.Stat(target); err == nil {
				continue
			}
			data, err := os.ReadFile(filepath.Join(srcDir, entry.Name()))
			if err != nil {
				continue
			}
			_ = os.WriteFile(target, data, 0o644)
		}
	}
}

func recordPath(root, bucket, id string) (string, bool) {
	safe, ok := safeRecordID(id)
	if !ok || !knownBucket(bucket) {
		return "", false
	}
	dir := filepath.Join(root, bucket)
	path := filepath.Join(dir, safe+".json")
	rel, err := filepath.Rel(filepath.Clean(root), path)
	if err != nil || strings.HasPrefix(rel, "..") {
		return "", false
	}
	return path, true
}

func downloadDirFile() string {
	return filepath.Join(filepath.Dir(settingsAutoPath()), "download-dir.txt")
}

func readDownloadDir() string {
	data, err := os.ReadFile(downloadDirFile())
	if err != nil {
		return ""
	}
	path := strings.TrimSpace(string(data))
	info, err := os.Stat(path)
	if err != nil || !info.IsDir() {
		return ""
	}
	return path
}

func downloadsInfo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"path": readDownloadDir()})
}

func downloadsChoose(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	picked, ok := pickFolder("Choose the folder for downloads")
	if !ok || picked == "" {
		writeJSON(w, http.StatusOK, map[string]bool{"cancelled": true})
		return
	}
	if err := os.MkdirAll(picked, 0o755); err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"message": "Could not use that folder."})
		return
	}
	if err := os.WriteFile(downloadDirFile(), []byte(picked), 0o600); err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"message": "Could not remember that folder."})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"path": picked})
}

func downloadsFile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	dir := readDownloadDir()
	if dir == "" {
		writeJSON(w, http.StatusOK, map[string]bool{"missing": true})
		return
	}
	name := safeDownloadName(r.Header.Get("X-Filename"))
	body, err := io.ReadAll(io.LimitReader(r.Body, 30<<20))
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "Could not read that file."})
		return
	}
	path := filepath.Join(dir, name)
	rel, err := filepath.Rel(filepath.Clean(dir), path)
	if err != nil || strings.HasPrefix(rel, "..") {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "That file name is not valid."})
		return
	}
	if err := os.WriteFile(path, body, 0o644); err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"message": "Could not write that file."})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"path": path})
}

func safeDownloadName(raw string) string {
	name := filepath.Base(strings.TrimSpace(raw))
	name = strings.Map(func(r rune) rune {
		if r < 32 || strings.ContainsRune(`<>:"/\|?*`, r) {
			return '-'
		}
		return r
	}, name)
	name = strings.Trim(name, ". ")
	if name == "" {
		return "download"
	}
	if len(name) > 180 {
		name = name[:180]
	}
	return name
}

func vaultInfo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	path, err := ensureVault()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Could not open the library folder."})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"path": path})
}

func vaultChoose(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	picked, ok := pickFolder("Choose where Cardwright saves cards and pictures")
	if !ok || picked == "" {
		writeJSON(w, http.StatusOK, map[string]bool{"cancelled": true})
		return
	}
	old, _ := ensureVault()
	if err := os.MkdirAll(picked, 0o755); err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"message": "Could not use that folder."})
		return
	}
	copyVault(old, picked)
	if err := setVaultRoot(picked); err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"message": "Could not remember that folder."})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"path": picked})
}

func vaultEntries(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	bucket := r.URL.Query().Get("bucket")
	if !knownBucket(bucket) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "Unknown library."})
		return
	}
	root, err := ensureVault()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Could not open the library folder."})
		return
	}
	entries, err := os.ReadDir(filepath.Join(root, bucket))
	if err != nil {
		writeJSON(w, http.StatusOK, map[string]any{"entries": []any{}})
		return
	}
	type head struct {
		ID        string `json:"id"`
		Name      string `json:"name"`
		UpdatedAt int64  `json:"updatedAt"`
	}
	list := make([]head, 0, len(entries))
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(strings.ToLower(entry.Name()), ".json") {
			continue
		}
		id := strings.TrimSuffix(entry.Name(), filepath.Ext(entry.Name()))
		item := head{ID: id, Name: id}
		data, err := os.ReadFile(filepath.Join(root, bucket, entry.Name()))
		if err == nil {
			var envelope struct {
				ID        string `json:"id"`
				Name      string `json:"name"`
				UpdatedAt int64  `json:"updatedAt"`
			}
			if json.Unmarshal(data, &envelope) == nil {
				if envelope.ID != "" {
					item.ID = envelope.ID
				}
				if envelope.Name != "" {
					item.Name = envelope.Name
				}
				item.UpdatedAt = envelope.UpdatedAt
			}
		}
		list = append(list, item)
	}
	writeJSON(w, http.StatusOK, map[string]any{"entries": list})
}

func vaultEntry(w http.ResponseWriter, r *http.Request) {
	bucket := r.URL.Query().Get("bucket")
	id := r.URL.Query().Get("id")
	root, err := ensureVault()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Could not open the library folder."})
		return
	}
	path, ok := recordPath(root, bucket, id)
	if !ok {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "That library record is not valid."})
		return
	}
	switch r.Method {
	case http.MethodGet:
		data, err := os.ReadFile(path)
		if err != nil {
			writeJSON(w, http.StatusOK, map[string]bool{"missing": true})
			return
		}
		var envelope map[string]any
		if json.Unmarshal(data, &envelope) != nil {
			writeJSON(w, http.StatusOK, map[string]bool{"missing": true})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"body": envelope["body"]})
	case http.MethodPut:
		body, err := io.ReadAll(io.LimitReader(r.Body, 32<<20))
		if err != nil || !json.Valid(body) {
			writeJSON(w, http.StatusBadRequest, map[string]string{"message": "That record was not valid."})
			return
		}
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Could not create the library folder."})
			return
		}
		if err := os.WriteFile(path, body, 0o644); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Could not write that record."})
			return
		}
		w.WriteHeader(http.StatusNoContent)
	case http.MethodDelete:
		_ = os.Remove(path)
		w.WriteHeader(http.StatusNoContent)
	default:
		http.Error(w, "method", http.StatusMethodNotAllowed)
	}
}

type browseInfoW struct {
	Owner       uintptr
	Root        uintptr
	DisplayName *uint16
	Title       *uint16
	Flags       uint32
	Callback    uintptr
	LParam      uintptr
	Image       int32
}

func pickFolder(title string) (string, bool) {
	ole32 := windows.NewLazySystemDLL("ole32.dll")
	shell32 := windows.NewLazySystemDLL("shell32.dll")
	_, _, _ = ole32.NewProc("CoInitializeEx").Call(0, 2)
	browse := shell32.NewProc("SHBrowseForFolderW")
	getPath := shell32.NewProc("SHGetPathFromIDListW")
	freeMem := ole32.NewProc("CoTaskMemFree")
	if err := browse.Find(); err != nil {
		return "", false
	}
	foreground, _, _ := windows.NewLazySystemDLL("user32.dll").NewProc("GetForegroundWindow").Call()
	display := make([]uint16, 260)
	titleUTF, err := windows.UTF16PtrFromString(title)
	if err != nil {
		return "", false
	}
	info := browseInfoW{
		Owner:       foreground,
		DisplayName: &display[0],
		Title:       titleUTF,
		Flags:       0x0001 | 0x0050,
	}
	pidl, _, _ := browse.Call(uintptr(unsafe.Pointer(&info)))
	if pidl == 0 {
		return "", false
	}
	defer freeMem.Call(pidl)
	buf := make([]uint16, 32768)
	ret, _, _ := getPath.Call(pidl, uintptr(unsafe.Pointer(&buf[0])))
	if ret == 0 {
		return "", false
	}
	path := windows.UTF16ToString(buf)
	if path == "" {
		return "", false
	}
	return path, true
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func safePngName(raw string) string {
	name := strings.TrimSpace(raw)
	name = strings.ReplaceAll(name, "\\", "")
	name = strings.ReplaceAll(name, "/", "")
	if name == "" || name == ".png" {
		return "novelai.png"
	}
	if !strings.HasSuffix(strings.ToLower(name), ".png") {
		name += ".png"
	}
	return name
}

type openFileName struct {
	StructSize      uint32
	Owner           uintptr
	Instance        uintptr
	Filter          uintptr
	CustomFilter    uintptr
	MaxCustomFilter uint32
	FilterIndex     uint32
	File            uintptr
	MaxFile         uint32
	FileTitle       uintptr
	MaxFileTitle    uint32
	InitialDir      uintptr
	Title           uintptr
	Flags           uint32
	FileOffset      uint16
	FileExtension   uint16
	DefExt          uintptr
	CustData        uintptr
	FnHook          uintptr
	TemplateName    uintptr
	PvReserved      uintptr
	DwReserved      uint32
	FlagsEx         uint32
}

func pickPath(save bool, suggested, title, filterLabel, pattern, ext string) (string, bool) {
	procName := "GetOpenFileNameW"
	flags := uint32(0x00080000 | 0x00000800 | 0x00000008)
	if save {
		procName = "GetSaveFileNameW"
		flags |= 0x00000002
	} else {
		flags |= 0x00001000
	}
	proc := windows.NewLazySystemDLL("comdlg32.dll").NewProc(procName)
	if err := proc.Find(); err != nil {
		return "", false
	}
	foreground, _, _ := windows.NewLazySystemDLL("user32.dll").NewProc("GetForegroundWindow").Call()
	suggestedUTF, err := windows.UTF16FromString(suggested)
	if err != nil {
		return "", false
	}
	buf := make([]uint16, 1024)
	copy(buf, suggestedUTF)
	filter := utf16Filter(filterLabel, pattern)
	titleUTF, err := windows.UTF16FromString(title)
	if err != nil {
		return "", false
	}
	defext, err := windows.UTF16FromString(ext)
	if err != nil {
		return "", false
	}
	ofn := openFileName{
		Owner:   foreground,
		Filter:  uintptr(unsafe.Pointer(&filter[0])),
		File:    uintptr(unsafe.Pointer(&buf[0])),
		MaxFile: uint32(len(buf)),
		Title:   uintptr(unsafe.Pointer(&titleUTF[0])),
		Flags:   flags,
		DefExt:  uintptr(unsafe.Pointer(&defext[0])),
	}
	ofn.StructSize = uint32(unsafe.Sizeof(ofn))
	ret, _, _ := proc.Call(uintptr(unsafe.Pointer(&ofn)))
	if ret == 0 {
		return "", false
	}
	path := windows.UTF16ToString(buf)
	if path == "" {
		return "", false
	}
	if save && ext != "" && !strings.HasSuffix(strings.ToLower(path), "."+strings.ToLower(ext)) {
		path += "." + ext
	}
	return path, true
}

func utf16Filter(label string, pattern string) []uint16 {
	first, _ := windows.UTF16FromString(label)
	second, _ := windows.UTF16FromString(pattern)
	out := append(append(first, second...), 0)
	return out
}

func alert(message string) {
	title, _ := windows.UTF16PtrFromString("Cardwright")
	body, _ := windows.UTF16PtrFromString(message)
	_, _, _ = procMessageBox.Call(0, uintptr(unsafe.Pointer(body)), uintptr(unsafe.Pointer(title)), 0x10)
}

var procMessageBox = windows.NewLazySystemDLL("user32.dll").NewProc("MessageBoxW")
