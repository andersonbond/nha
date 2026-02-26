"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const ESRI_SATELLITE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTRIBUTION =
  "© Esri, Maxar, Earthstar Geographics, and the GIS User Community";

type SatelliteMapProps = {
  className?: string;
  center?: [number, number];
  zoom?: number;
  height?: number;
};

export function SatelliteMap({
  className = "",
  center = [14.58, 121.02],
  zoom = 13,
  height = 320,
}: SatelliteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const centerLat = center[0];
  const centerLng = center[1];

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;
      if (mapRef.current) return;
      const map = L.default.map(containerRef.current, {
        center: [centerLat, centerLng],
        zoom,
        zoomControl: true,
      });
      L.default.control
        .zoom({ position: "topright" })
        .addTo(map);
      L.default.tileLayer(ESRI_SATELLITE_URL, {
        attribution: ESRI_ATTRIBUTION,
        maxZoom: 18,
      }).addTo(map);
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [centerLat, centerLng, zoom]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: `${height}px` }}
      aria-label="Satellite map"
    />
  );
}
