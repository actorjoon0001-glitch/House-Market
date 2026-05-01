import { DEMO_ARCHITECTS } from "../src/lib/demo/architects";

function esc(v: string | undefined | null): string {
  if (v === undefined || v === null) return "null";
  return `'${v.replace(/'/g, "''")}'`;
}

function arr(items: string[]): string {
  return `array[${items.map((x) => esc(x)).join(", ")}]::text[]`;
}

function num(v: number | undefined | null): string {
  return v === undefined || v === null ? "null" : String(v);
}

function bool(v: boolean): string {
  return v ? "true" : "false";
}

const lines: string[] = [
  "-- 데모 업체 시드 데이터 (27개)",
  "-- 적용: Supabase SQL Editor에서 이 파일 전체 붙여넣기 → Run",
  "-- 멱등: 같은 id 있으면 update.",
  "",
  "insert into public.companies (",
  "  id, name, region, address, lat, lng, phone, specialties, description,",
  "  rating, review_count, verified_status, data_source,",
  "  is_listed_without_consent, consent_given, contact_public",
  ") values",
];

const rows = DEMO_ARCHITECTS.map((a) => {
  return (
    `  (${esc(a.id)}, ${esc(a.name)}, ${esc(a.region)}, ${esc(a.address)}, ` +
    `${num(a.lat)}, ${num(a.lng)}, ${esc(a.phone || "")}, ${arr(a.specialties as string[])}, ` +
    `${esc(a.description)}, ${num(a.rating)}, ${num(a.reviewCount)}, ` +
    `'${a.verifiedStatus}', '${a.dataSource}', ` +
    `${bool(a.isListedWithoutConsent)}, ${bool(a.consentGiven)}, ${bool(a.contactPublic)})`
  );
});

lines.push(rows.join(",\n"));
lines.push("on conflict (id) do update set");
lines.push("  name = excluded.name,");
lines.push("  region = excluded.region,");
lines.push("  address = excluded.address,");
lines.push("  lat = excluded.lat,");
lines.push("  lng = excluded.lng,");
lines.push("  phone = excluded.phone,");
lines.push("  specialties = excluded.specialties,");
lines.push("  description = excluded.description,");
lines.push("  rating = excluded.rating,");
lines.push("  review_count = excluded.review_count,");
lines.push("  verified_status = excluded.verified_status,");
lines.push("  data_source = excluded.data_source,");
lines.push("  is_listed_without_consent = excluded.is_listed_without_consent,");
lines.push("  consent_given = excluded.consent_given,");
lines.push("  contact_public = excluded.contact_public,");
lines.push("  updated_at = now();");
lines.push("");

console.log(lines.join("\n"));
