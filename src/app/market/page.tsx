import Link from "next/link";

export default function MarketPage() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">동네 중고거래</h1>
        <Link
          href="/market/new"
          className="rounded-full bg-brand px-3 py-1.5 text-sm font-medium text-white"
        >
          글쓰기
        </Link>
      </header>

      <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
        첫 매물을 등록해보세요.
      </div>
    </div>
  );
}
