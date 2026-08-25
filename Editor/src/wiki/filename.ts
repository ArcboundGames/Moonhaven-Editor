export function wikiFileName(name: string): string {
  return name.trim().replace(/\s+/g, '_');
}

export function wikiPageTitle(name: string): string {
  return name.trim();
}

export function wikiImageMarkup(name: string, options?: { size?: string; center?: boolean }): string {
  const fileName = `${wikiFileName(name)}.png`;
  const parts = [fileName];
  if (options?.center) {
    parts.push('center');
  }
  if (options?.size) {
    parts.push(options.size);
  }
  return `[[File:${parts.join('|')}]]`;
}
