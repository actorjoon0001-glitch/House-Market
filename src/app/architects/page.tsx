import Link from "next/link";
import {
  DEMO_ARCHITECTS,
  SPECIALTY_COLOR,
  SPECIALTY_LABEL,
  type BuildSpecialty,
} from "@/lib/demo/architects";

const FILTERS: { key: "ALL" | BuildSpecialty; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "STAY_REST_HOUSE", label: SPECIALTY_LABEL.STAY_REST_HOUSE },
  { key: "MOBILE_HOUSE", label: SPECIALTY_LABEL.MOBILE_HOUSE },
  { key: "COUNTRY_HOUSE", label: SPECIALTY_LABEL.COUNTRY_HOUSE },
  { key: "PASSIVE_HOUSE", label: SPECIALTY_LABEL.PASSIVE_HOUSE },
  { key: "REMODEL", label: SPECIALTY_LABEL.REMODEL },
];

export default function ArchitectsPage({
  searchParams,
}: {
  searchParams: { specialty?: string };
}) {
  const active = (searchParams.specialty ?? "ALL") as "ALL" | BuildSpecialty;
  const list =
    active === "ALL"
      ? DEMO_ARCHITECTS
      : DEMO_ARCHITECTS.filter((a) =>
          a.specialties.includes(active as BuildSpecialty),
        );

  return (
    <div className="flex flex-col gap-4 p-4 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">전국 입점 업체</h1>
          <p className="mt-1 text-sm text-gray-500">
            체류형 쉼터 · 이동식 주택 · 전원주택 시공이 가능한 업체
          </p>
        </div>
        <Link
          href="/apply"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          + 우리 업체 등록
        </Link>
      </header>

      <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2.5 text-xs text-yellow-800">
        ⓘ 표시된 업체는 모두 <strong>샘플 데이터</strong>입니다. 실제 업체는
        본인 동의를 거쳐 입점 신청한 사업자만 노출됩니다 (개인정보보호법 준수).
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const on = active === f.key;
          return (
            <Link
              key={f.key}
              href={f.key === "ALL" ? "/architects" : `/architects?specialty=${f.key}`}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                on
                  ? "border-brand bg-brand text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-brand-100"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        총 <strong>{list.length}</strong>개 업체
      </p>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <li
            key={a.id}
            className="rounded-2xl border border-gray-100 p-4 transition hover:border-brand-100 hover:shadow-sm"
          >
            <p className="text-xs text-gray-400">{a.region}</p>
            <p className="mt-0.5 text-base font-semibold">{a.name}</p>
            <p className="mt-1.5 text-sm text-gray-600">{a.description}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {a.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                  style={{ backgroundColor: SPECIALTY_COLOR[s] }}
                >
                  {SPECIALTY_LABEL[s]}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">📍 {a.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
