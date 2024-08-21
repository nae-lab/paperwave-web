export function capitalize(text: string) {
  return text.replace(/(^|\s)\w/g, (c) => c.toUpperCase());
}
