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

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const L = require("leaflet");

    if (mapRef.current) return;
    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
    });
    L.control
      .zoom({ position: "topright" })
      .addTo(map);
    L.tileLayer(ESRI_SATELLITE_URL, {
      attribution: ESRI_ATTRIBUTION,
      maxZoom: 18,
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center[0], center[1], zoom]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: `${height}px` }}
      aria-label="Satellite map"
    />
  );
}
