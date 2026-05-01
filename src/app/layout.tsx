import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SideNav from "@/components/SideNav";

export const metadata: Metadata = {
  title: "집마켓 - 건축주·건축사·자재상 그리고 동네 중고거래",
  description:
    "집 짓고, 고치고, 거래하는 모든 것. 가까운 건축사·자재상·중고매물을 지도에서 한눈에.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#FF6F0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-white md:flex">
          <SideNav />
          <div className="mx-auto flex w-full max-w-[480px] flex-col md:max-w-none md:flex-1">
            <main className="flex-1 pb-16 md:pb-8">
              <div className="mx-auto w-full md:max-w-5xl md:px-6">{children}</div>
            </main>
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
