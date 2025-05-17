export function formatThousands(num: number) {
  const n = Number(num);
  if (isNaN(n)) return String(num);
  return n.toLocaleString();
}
