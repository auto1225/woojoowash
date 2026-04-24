export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export function formatWon(n: number) {
  return `${n.toLocaleString("ko-KR")}원`;
}
