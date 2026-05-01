import Link from "next/link";

type Variant = "compact" | "full" | "banner";

const POINTS = [
  "집마켓은 건축 설계·시공을 직접 수행하지 않습니다.",
  "AI 설계 결과물은 참고용 콘셉트이며 법적 설계도면이 아닙니다.",
  "실제 설계, 인허가, 시공 계약은 관련 자격을 가진 전문가와 사용자 간에 직접 진행됩니다.",
  "업체 정보는 입점 동의 및 사업자 확인 후 노출됩니다.",
];

type Props = {
  variant?: Variant;
  className?: string;
};

export default function LegalNotice({
  variant = "full",
  className = "",
}: Props) {
  if (variant === "banner") {
    return (
      <div
        className={`rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800 ${className}`}
      >
        ⓘ 표시된 업체는 <strong>샘플 데이터</strong>입니다. 실제 업체는 입점
        동의 및 사업자 확인 후 노출됩니다.
        <Link href="/apply" className="ml-1 underline">
          입점 신청 →
        </Link>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <p
        className={`rounded-lg bg-gray-50 px-3 py-2 text-[11px] leading-relaxed text-gray-500 ${className}`}
      >
        집마켓은 정보 제공 및 상담 연결 도구이며, 설계·시공·계약은 사용자와
        전문가 간 직접 진행됩니다.
      </p>
    );
  }

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs leading-relaxed text-gray-600 ${className}`}
    >
      <p className="mb-2 font-semibold text-gray-700">📋 서비스 안내</p>
      <ul className="flex flex-col gap-1.5">
        {POINTS.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-gray-400">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
