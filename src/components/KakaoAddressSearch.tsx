"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export type ResolvedAddress = {
  address: string;
  roadAddress?: string;
  lat: number;
  lng: number;
  region?: string;
};

type Props = {
  initialAddress?: string;
  placeholder?: string;
  onResolve: (addr: ResolvedAddress) => void;
};

type Suggestion = {
  id: string;
  /** Display label */
  label: string;
  /** Secondary label (place category or jibun address) */
  sub?: string;
  lat: number;
  lng: number;
  address: string;
  roadAddress?: string;
  region?: string;
};

export default function KakaoAddressSearch({
  initialAddress = "",
  placeholder = "주소를 검색하세요 (예: 강남구 테헤란로)",
  onResolve,
}: Props) {
  const [query, setQuery] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [picked, setPicked] = useState<Suggestion | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  useEffect(() => {
    if (!sdkReady) return;
    if (!query.trim() || picked?.label === query) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(query);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, sdkReady]);

  function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const places = new window.kakao.maps.services.Places();

      const collected: Suggestion[] = [];
      let pendingCalls = 2;
      const finish = () => {
        pendingCalls -= 1;
        if (pendingCalls === 0) {
          // Dedupe by lat/lng (places + geocode often overlap)
          const seen = new Set<string>();
          const deduped = collected.filter((s) => {
            const k = `${s.lat.toFixed(5)},${s.lng.toFixed(5)}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          });
          setSuggestions(deduped.slice(0, 8));
          setOpen(true);
          setLoading(false);
        }
      };

      geocoder.addressSearch(q, (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          for (const r of result) {
            collected.push({
              id: `addr-${r.address_name}-${r.x}`,
              label: r.address_name,
              sub: r.road_address?.address_name,
              lat: Number(r.y),
              lng: Number(r.x),
              address: r.address_name,
              roadAddress: r.road_address?.address_name,
              region: r.address?.region_1depth_name,
            });
          }
        }
        finish();
      });

      places.keywordSearch(q, (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          for (const r of result) {
            collected.push({
              id: `place-${r.id}`,
              label: r.place_name,
              sub: r.road_address_name || r.address_name,
              lat: Number(r.y),
              lng: Number(r.x),
              address: r.address_name,
              roadAddress: r.road_address_name,
              region: r.address_name?.split(" ")[0],
            });
          }
        }
        finish();
      });
    });
  }

  function pick(s: Suggestion) {
    setPicked(s);
    setQuery(s.label);
    setOpen(false);
    onResolve({
      address: s.address,
      roadAddress: s.roadAddress,
      lat: s.lat,
      lng: s.lng,
      region: s.region,
    });
  }

  if (!appKey) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-3 text-xs text-gray-500">
        주소 검색을 사용하려면 <code>NEXT_PUBLIC_KAKAO_MAP_KEY</code>를 설정하세요.
      </div>
    );
  }

  return (
    <div className="relative">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPicked(null);
        }}
        onFocus={() => suggestions.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      {loading && (
        <p className="absolute right-3 top-3 text-xs text-gray-400">검색 중...</p>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                className="flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left text-sm hover:bg-brand-50"
              >
                <span className="font-medium text-gray-900">{s.label}</span>
                {s.sub && <span className="text-xs text-gray-500">{s.sub}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {picked && !open && (
        <p className="mt-1.5 text-xs text-brand">
          📍 {picked.lat.toFixed(5)}, {picked.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
