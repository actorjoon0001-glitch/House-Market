"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { unreadCount } from "@/lib/consultations/store";

const tabs = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/projects", label: "AI 설계", icon: "📐" },
  { href: "/map", label: "전문가 지도", icon: "🗺️" },
  { href: "/architects", label: "전문가 찾기", icon: "🏢" },
  { href: "/consultations", label: "내 상담함", icon: "✉️", badge: true },
  { href: "/favorites", label: "관심 업체", icon: "♡" },
  { href: "/market", label: "중고거래", icon: "🛒" },
  { href: "/me", label: "내정보", icon: "👤" },
];

export default function SideNav() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    setUnread(unreadCount());
    // pathname이 바뀔 때마다 다시 계산 (다른 탭에서 답변을 받고 돌아왔을 수 있음)
  }, [pathname]);

  return (
    <aside className="hidden h-screen w-60 shrink-0 border-r border-gray-100 bg-white md:sticky md:top-0 md:block">
      <div className="px-5 pb-2 pt-6">
        <Link href="/" className="block">
          <p className="text-2xl font-extrabold tracking-tight">
            집마켓<span className="text-brand">.</span>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            AI로 구상하고, 전문가에게 상담하기
          </p>
        </Link>
      </div>
      <nav className="px-3 py-3">
        <ul className="flex flex-col gap-1">
          {tabs.map((t) => {
            const active =
              t.href === "/" ? pathname === "/" : pathname?.startsWith(t.href);
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand-50 text-brand"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg leading-none">{t.icon}</span>
                  <span className="flex-1">{t.label}</span>
                  {t.badge && unread > 0 && (
                    <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-3 pt-2">
        <Link
          href="/apply"
          className="block rounded-xl border border-brand-100 bg-brand-50 px-3 py-2.5 text-center text-sm font-medium text-brand"
        >
          + 업체 입점 신청
        </Link>
        <Link
          href="/owner/consultations"
          className="mt-2 block rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-xs text-gray-600"
        >
          업체 상담 관리 (데모)
        </Link>
      </div>
    </aside>
  );
}
