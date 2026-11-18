import { isDesktopHost } from "@/lib/kobold";

const CARD_ACCEPT = "application/json,.json,image/png,.png";

export function settleView() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function pickBrowserFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.tabIndex = -1;
    input.setAttribute("aria-hidden", "true");
    input.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;margin:0;padding:0;opacity:0;overflow:hidden;";
    let done = false;
    const finish = (file: File | null) => {
      if (done) return;
      done = true;
      input.remove();
      settleView();
      resolve(file);
    };
    input.addEventListener("change", () => finish(input.files?.[0] ?? null));
    input.addEventListener("cancel", () => finish(null));
    document.body.appendChild(input);
    input.click();
  });
}

export async function pickCardFile(): Promise<File | null> {
  settleView();
  if (await isDesktopHost()) {
    const response = await fetch("/__pick-card", { method: "POST" });
    const payload = (await response.json().catch(() => ({}))) as {
      cancelled?: boolean;
      name?: string;
      type?: string;
      data?: string;
      message?: string;
    };
    settleView();
    if (!response.ok) throw new Error(payload.message || "Could not open that card.");
    if (payload.cancelled || !payload.data) return null;
    const binary = atob(payload.data);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new File([bytes], payload.name || "card.json", { type: payload.type || "application/octet-stream" });
  }
  return pickBrowserFile(CARD_ACCEPT);
}
