import Link from "next/link";

export default function MePage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">내정보</h1>
      <Link
        href="/login"
        className="block rounded-2xl bg-brand px-4 py-3 text-center text-sm font-medium text-white"
      >
        로그인 / 회원가입
      </Link>
      <ul className="rounded-2xl border border-gray-100">
        {["내가 쓴 글", "관심 업체", "견적 요청 내역", "설정"].map((m) => (
          <li
            key={m}
            className="border-b border-gray-100 px-4 py-3 text-sm last:border-b-0"
          >
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
