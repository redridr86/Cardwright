import { boxPaint, lookOf, splitDialogue, textPaint, type AppTheme, type ChatLook } from "@/lib/look";

export function ChatColors({
  look,
  theme,
  name,
  onChange,
}: {
  look: ChatLook;
  theme: AppTheme;
  name: string;
  onChange: (look: ChatLook) => void;
}) {
  const raw: ChatLook = {
    nameColor: look?.nameColor ?? "",
    dialogueColor: look?.dialogueColor ?? "",
    boxColor: look?.boxColor ?? "",
  };
  const current = lookOf(raw);
  const dialogue = current.dialogueColor || theme.dialogueDefault;

  function patch(key: keyof ChatLook, value: string) {
    onChange({ ...raw, [key]: value });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted">
        Name color is the display name. Dialogue color is the text inside quotation marks. Box color is the message bubble. Gradients use CSS
        linear-gradient. Empty dialogue uses the default under Colors. Other empty fields use the theme.
      </p>
      <ColorRow label="Name color" value={raw.nameColor} onChange={(value) => patch("nameColor", value)} placeholder="#e8b86d or linear-gradient(90deg, #e8b86d, #d4654a)" />
      <ColorRow label="Dialogue color" value={raw.dialogueColor} onChange={(value) => patch("dialogueColor", value)} placeholder="Empty uses the Colors default" />
      <ColorRow label="Box color" value={raw.boxColor} onChange={(value) => patch("boxColor", value)} placeholder="Empty uses the chat paper" />
      <article className="rounded-md bg-paper p-3 text-ink" style={boxPaint(current.boxColor)}>
        <p className="text-sm font-semibold" style={textPaint(current.nameColor, theme.ink)}>
          {name.trim() || "Character"}
        </p>
        <p className="mt-1 text-sm whitespace-pre-wrap" style={{ color: theme.ink }}>
          {splitDialogue('They look over. "Stay close." *A lamp flickers.*').map((part, index) =>
            part.kind === "talk" ? (
              <span key={index} style={{ ...textPaint(dialogue, theme.ink), fontWeight: theme.boldDialogue ? 700 : 400 }}>
                {part.text}
              </span>
            ) : (
              <span key={index} className={part.kind === "act" ? "italic" : undefined}>
                {part.text}
              </span>
            ),
          )}
        </p>
      </article>
    </div>
  );
}

function ColorRow({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const hex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#d4654a";
  return (
    <label className="block text-xs font-semibold tracking-wide text-muted uppercase">
      {label}
      <span className="mt-1 flex min-w-0 gap-2">
        <input
          type="color"
          value={hex}
          aria-label={`${label} swatch`}
          onChange={(event) => onChange(event.target.value)}
          className="size-11 shrink-0 rounded-md border border-border bg-bg"
        />
        <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg" />
      </span>
    </label>
  );
}
