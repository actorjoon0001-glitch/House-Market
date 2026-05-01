"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/map", label: "지도", icon: "🗺️" },
  { href: "/market", label: "중고", icon: "🛒" },
  { href: "/chat", label: "채팅", icon: "💬" },
  { href: "/me", label: "내정보", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-[480px] border-t border-gray-100 bg-white">
        <ul className="grid grid-cols-5">
          {tabs.map((t) => {
            const active =
              t.href === "/" ? pathname === "/" : pathname?.startsWith(t.href);
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className={`flex flex-col items-center gap-0.5 py-2 text-xs ${
                    active ? "text-brand" : "text-gray-500"
                  }`}
                >
                  <span className="text-lg leading-none">{t.icon}</span>
                  <span>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
