export const SERVICE_LABEL: Record<string, string> = {
  self: "셀프세차",
  hand: "손세차",
  visit: "출장세차",
  premium: "프리미엄 자동세차",
  // legacy / 마켓
  pickup: "배달세차",
  market: "마켓",
};

// 파트너 CMS에서 매장이 선택할 수 있는 서비스 카테고리 (순서 = UI 노출 순서)
export const SELECTABLE_SERVICES: ReadonlyArray<{
  code: string;
  label: string;
}> = [
  { code: "self", label: SERVICE_LABEL.self },
  { code: "hand", label: SERVICE_LABEL.hand },
  { code: "visit", label: SERVICE_LABEL.visit },
  { code: "premium", label: SERVICE_LABEL.premium },
];

export function labelService(code: string): string {
  return SERVICE_LABEL[code] ?? code;
}

export function labelServices(codes: string[]): string[] {
  return codes.map(labelService);
}
