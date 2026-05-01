const CATEGORIES = [
  { key: "ARCHITECT", label: "건축사" },
  { key: "CONTRACTOR", label: "시공사" },
  { key: "MATERIAL", label: "자재상" },
  { key: "INTERIOR", label: "인테리어" },
  { key: "ETC", label: "기타" },
];

export default function CompaniesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const active = searchParams.category ?? "ARCHITECT";

  return (
    <div className="flex flex-col gap-3 p-4">
      <h1 className="text-xl font-bold">입점 업체</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => {
          const on = c.key === active;
          return (
            <a
              key={c.key}
              href={`/companies?category=${c.key}`}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${
                on
                  ? "border-brand bg-brand text-white"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              {c.label}
            </a>
          );
        })}
      </div>

      <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
        아직 등록된 업체가 없어요.
      </div>
    </div>
  );
}
