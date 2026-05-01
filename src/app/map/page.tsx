"use client";

import { useEffect, useMemo, useState } from "react";
import KakaoMap, { MapPin } from "@/components/KakaoMap";

const SAMPLE_PINS: MapPin[] = [
  { id: "a1", name: "행복건축사사무소", lat: 37.5662, lng: 126.9779, category: "ARCHITECT" },
  { id: "a2", name: "튼튼시공", lat: 37.5675, lng: 126.9810, category: "CONTRACTOR" },
  { id: "a3", name: "한일자재마트", lat: 37.5648, lng: 126.9755, category: "MATERIAL" },
  { id: "a4", name: "온수리인테리어", lat: 37.5689, lng: 126.9742, category: "INTERIOR" },
];

export default function MapPage() {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [selected, setSelected] = useState<MapPin | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }, []);

  const pins = useMemo(() => SAMPLE_PINS, []);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <KakaoMap pins={pins} center={center} onSelect={setSelected} />

      {selected && (
        <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-4 shadow-lg">
          <p className="text-xs text-brand">{selected.category}</p>
          <p className="mt-0.5 text-base font-semibold">{selected.name}</p>
          <p className="mt-1 text-xs text-gray-500">
            {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
          </p>
          <button
            className="mt-3 w-full rounded-xl bg-brand py-2 text-sm font-medium text-white"
            onClick={() => setSelected(null)}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
}
