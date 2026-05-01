"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LegalNotice from "@/components/LegalNotice";
import {
  listConsultationsForUser,
  listFavoriteCompanyIds,
  listNotifications,
  markAllRead,
  unreadCount,
} from "@/lib/consultations/store";

const MENU = [
  {
    href: "/projects",
    icon: "📐",
    label: "내 프로젝트",
    sub: "AI 콘셉트 설계 기록",
  },
  {
    href: "/consultations",
    icon: "✉️",
    label: "내 상담함",
    sub: "보낸 상담 요청 + 답변",
  },
  {
    href: "/favorites",
    icon: "♡",
    label: "관심 업체",
    sub: "저장한 업체 모아보기",
  },
  {
    href: "/compare",
    icon: "⚖️",
    label: "업체 비교",
    sub: "관심 업체 한눈에 비교",
  },
  {
    href: "/owner/consultations",
    icon: "🏢",
    label: "업체 상담 관리",
    sub: "(데모) 입점 업체로 들어온 상담",
  },
  {
    href: "/apply",
    icon: "📝",
    label: "업체 입점 신청",
    sub: "사업자 확인 후 노출",
  },
];

export default function MePage() {
  const [counts, setCounts] = useState({
    consultations: 0,
    favorites: 0,
    unread: 0,
  });
  const [notes, setNotes] = useState<
    { id: string; title: string; body: string; readAt?: string; link?: string }[]
  >([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [cons, favs, unread, notif] = await Promise.all([
        listConsultationsForUser(),
        listFavoriteCompanyIds(),
        unreadCount(),
        listNotifications(),
      ]);
      if (!active) return;
      setCounts({
        consultations: cons.length,
        favorites: favs.length,
        unread,
      });
      setNotes(notif.slice(0, 5));
    })();
    return () => {
      active = false;
    };
  }, []);

  async function clearUnread() {
    await markAllRead();
    setCounts((c) => ({ ...c, unread: 0 }));
    const refreshed = await listNotifications();
    setNotes(refreshed.slice(0, 5));
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:py-8">
      <header>
        <Link
          href="/login"
          className="rounded-full border border-brand bg-brand-50 px-3 py-1 text-xs font-medium text-brand"
        >
          로그인 / 회원가입
        </Link>
        <h1 className="mt-3 text-2xl font-bold md:text-3xl">내정보</h1>
      </header>

      <section className="grid grid-cols-3 gap-2">
        <Stat label="상담" value={counts.consultations} />
        <Stat label="관심" value={counts.favorites} />
        <Stat label="알림" value={counts.unread} highlight={counts.unread > 0} />
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold">알림</p>
          {counts.unread > 0 && (
            <button
              onClick={clearUnread}
              className="text-[11px] text-brand"
            >
              모두 읽음
            </button>
          )}
        </div>
        {notes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
            새 알림이 없어요.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {notes.map((n) => (
              <li
                key={n.id}
                className={`rounded-xl border p-3 text-xs ${
                  n.readAt
                    ? "border-gray-100 bg-white text-gray-600"
                    : "border-brand-100 bg-brand-50 text-gray-800"
                }`}
              >
                <p className="font-semibold">{n.title}</p>
                <p className="mt-0.5 text-gray-500">{n.body}</p>
                {n.link && (
                  <Link
                    href={n.link}
                    className="mt-1 inline-block text-[11px] text-brand underline"
                  >
                    이동 →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ul className="rounded-2xl border border-gray-100">
        {MENU.map((m, i) => (
          <li key={m.href}>
            <Link
              href={m.href}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < MENU.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{m.label}</p>
                <p className="text-[11px] text-gray-500">{m.sub}</p>
              </div>
              <span className="text-gray-300">›</span>
            </Link>
          </li>
        ))}
      </ul>

      <LegalNotice variant="compact" />
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-3 text-center ${
        highlight ? "border-brand bg-brand-50" : "border-gray-100"
      }`}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`mt-1 text-2xl font-extrabold ${highlight ? "text-brand" : "text-gray-900"}`}
      >
        {value}
      </p>
    </div>
  );
}
