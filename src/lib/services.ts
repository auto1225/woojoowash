export const SERVICE_LABEL: Record<string, string> = {
  self: "셀프",
  hand: "손세차",
  pickup: "배달세차",
  visit: "출장세차",
  premium: "프리미엄",
  market: "마켓",
};

export function labelService(code: string): string {
  return SERVICE_LABEL[code] ?? code;
}

export function labelServices(codes: string[]): string[] {
  return codes.map(labelService);
}
