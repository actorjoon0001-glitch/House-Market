"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export type MapPin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
};

type Props = {
  pins?: MapPin[];
  center?: { lat: number; lng: number };
  level?: number;
  onSelect?: (pin: MapPin) => void;
};

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export default function KakaoMap({
  pins = [],
  center = DEFAULT_CENTER,
  level = 5,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(containerRef.current, {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level,
      });
      mapRef.current = map;
    });
  }, [ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    pins.forEach((pin) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(pin.lat, pin.lng),
        title: pin.name,
      });
      marker.setMap(map);
      window.kakao.maps.event.addListener(marker, "click", () =>
        onSelect?.(pin),
      );
      markersRef.current.push(marker);
    });
  }, [pins, onSelect]);

  if (!appKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 p-6 text-center text-sm text-gray-500">
        <div>
          <p className="font-medium text-gray-700">카카오맵 키가 없습니다</p>
          <p className="mt-1">
            <code>.env.local</code>에{" "}
            <code className="rounded bg-gray-100 px-1">
              NEXT_PUBLIC_KAKAO_MAP_KEY
            </code>
            를 설정하세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div ref={containerRef} className="h-full w-full" />
    </>
  );
}
