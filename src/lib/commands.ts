const registry = new Map<string, () => void>();

export function onCommand(name: string, run: () => void): () => void {
  registry.set(name, run);
  return () => {
    if (registry.get(name) === run) registry.delete(name);
  };
}

export function runCommand(name: string) {
  registry.get(name)?.();
}
