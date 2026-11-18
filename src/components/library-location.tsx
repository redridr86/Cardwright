import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { runCommand } from "@/lib/commands";
import { downloadFolderLabel } from "@/lib/save-file";
import { vaultInfo, type VaultInfo } from "@/lib/vault";

export function LibraryLocation() {
  const [info, setInfo] = useState<VaultInfo | null>(null);
  const [downloads, setDownloads] = useState("");

  useEffect(() => {
    const refresh = () => {
      void vaultInfo().then(setInfo);
      void downloadFolderLabel().then(setDownloads).catch(() => setDownloads(""));
    };
    refresh();
    window.addEventListener("cardwright-vault", refresh);
    window.addEventListener("cardwright-downloads", refresh);
    return () => {
      window.removeEventListener("cardwright-vault", refresh);
      window.removeEventListener("cardwright-downloads", refresh);
    };
  }, []);

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold text-fg">Where cards and pictures are saved</h2>
          <p className="truncate text-sm text-gold">{info?.label ?? "Checking…"}</p>
          <p className="text-sm text-muted">{info?.detail ?? "There is no slot limit. Each card and picture is its own file."}</p>
        </div>
        <button
          type="button"
          onClick={() => runCommand("file.libraryFolder")}
          className="flex min-h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg"
        >
          <FolderOpen className="size-4" aria-hidden="true" />
          Choose folder
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold text-fg">Download folder</h2>
          <p className="truncate text-sm text-gold">{downloads || "Not chosen yet"}</p>
          <p className="text-sm text-muted">JSON cards, PNG cards, and pictures are written here when a folder is set.</p>
        </div>
        <button
          type="button"
          onClick={() => runCommand("file.downloadFolder")}
          className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-sm font-semibold text-fg"
        >
          <FolderOpen className="size-4" aria-hidden="true" />
          Choose folder
        </button>
      </div>
    </section>
  );
}