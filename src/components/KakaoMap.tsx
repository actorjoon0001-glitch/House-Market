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
  /** Marker dot color (hex). When set, a circular SVG marker is used. */
  color?: string;
};

type Props = {
  pins?: MapPin[];
  center?: { lat: number; lng: number };
  level?: number;
  /** When true, fits the map bounds to all pins after they are placed. */
  fitBounds?: boolean;
  onSelect?: (pin: MapPin) => void;
};

const DEFAULT_CENTER = { lat: 36.3, lng: 127.8 };

export default function KakaoMap({
  pins = [],
  center = DEFAULT_CENTER,
  level = 13,
  fitBounds = false,
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

    const bounds = new window.kakao.maps.LatLngBounds();

    pins.forEach((pin) => {
      const position = new window.kakao.maps.LatLng(pin.lat, pin.lng);
      bounds.extend(position);

      const marker = pin.color
        ? new window.kakao.maps.Marker({
            position,
            title: pin.name,
            image: makeColoredMarkerImage(pin.color),
          })
        : new window.kakao.maps.Marker({ position, title: pin.name });

      marker.setMap(map);
      window.kakao.maps.event.addListener(marker, "click", () =>
        onSelect?.(pin),
      );
      markersRef.current.push(marker);
    });

    if (fitBounds && pins.length > 0) {
      map.setBounds(bounds, 32, 32, 32, 32);
    }
  }, [pins, onSelect, fitBounds]);

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

function makeColoredMarkerImage(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><path d="M14 0C6.27 0 0 6.27 0 14c0 9.62 12.13 21.05 13.05 21.86a1.41 1.41 0 0 0 1.9 0C15.87 35.05 28 23.62 28 14 28 6.27 21.73 0 14 0z" fill="${color}"/><circle cx="14" cy="14" r="5.5" fill="white"/></svg>`;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return new window.kakao.maps.MarkerImage(
    url,
    new window.kakao.maps.Size(28, 36),
    { offset: new window.kakao.maps.Point(14, 36) },
  );
}
