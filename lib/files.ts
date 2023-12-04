export async function readLinesFromFile(path: string): Promise<string[]> {
  const file = Bun.file(path);
  const text = await file.text();
  return text.trim().split('\n');
}
