import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "우주워시 — 내 차를 빛나게 만드는 가장 쉬운 방법",
  description:
    "셀프세차 · 손세차 · 픽업 배달까지. 전국 450개 매장을 우주워시 한 앱에서 예약하세요.",
  openGraph: {
    title: "우주워시",
    description: "세차 예약 플랫폼",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
