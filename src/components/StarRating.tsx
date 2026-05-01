"use client";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
};

export default function StarRating({
  value,
  onChange,
  size = "md",
  readOnly,
}: Props) {
  const sizeCls = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <div className={`inline-flex items-center gap-0.5 ${sizeCls}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const star = (
          <span
            className={
              filled ? "text-yellow-400" : "text-gray-300"
            }
            aria-hidden
          >
            ★
          </span>
        );
        if (readOnly || !onChange) {
          return <span key={n}>{star}</span>;
        }
        return (
          <button
            type="button"
            key={n}
            onClick={() => onChange(n)}
            aria-label={`${n}점`}
            className="transition hover:scale-110"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
