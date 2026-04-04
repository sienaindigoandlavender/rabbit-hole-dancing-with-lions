"use client";

import { useEffect, useRef, useState, useCallback, CSSProperties } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DecoderPoint } from "@/app/lib/supabase";
import PointCard from "./PointCard";

const STYLES = {
  dark: "mapbox://styles/mapbox/dark-v11",
  light: "mapbox://styles/mapbox/light-v11",
  satellite: "mapbox://styles/mapbox/satellite-v9",
};

const PAGE_BG = "#f7f5f0";

function applyTransparentStyle(map: mapboxgl.Map) {
  // Make water and background match the page
  const style = map.getStyle();
  if (!style) return;
  style.layers.forEach((layer) => {
    if (layer.id === "background" && layer.type === "background") {
      map.setPaintProperty("background", "background-color", PAGE_BG);
    }
    if (layer.id === "water" || layer.id.startsWith("water")) {
      if (layer.type === "fill") {
        map.setPaintProperty(layer.id, "fill-color", "#e8e5de");
      }
    }
    // Soften land boundaries
    if (layer.id.includes("boundary") || layer.id.includes("admin")) {
      if (layer.type === "line") {
        map.setPaintProperty(layer.id, "line-opacity", 0.15);
      }
    }
    // Soften labels
    if (layer.type === "symbol") {
      map.setPaintProperty(layer.id, "text-opacity", 0.4);
    }
  });
}

interface MapExplorerProps {
  points: DecoderPoint[];
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  showCard?: boolean;
  showStyleToggle?: boolean;
  showCoordinates?: boolean;
  mapStyle?: "dark" | "light";
  transparent?: boolean;
  className?: string;
  style?: CSSProperties;
}

function formatCoord(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

function getArchiveNumber(point: DecoderPoint): string {
  const num = point.id.replace(/[^0-9]/g, "").slice(-3).padStart(3, "0");
  return `MA-${num}`;
}

export default function MapExplorer({
  points,
  center = [20, 15],
  zoom = 1.8,
  interactive = true,
  showCard = true,
  showStyleToggle = false,
  showCoordinates = false,
  mapStyle = "dark",
  transparent = false,
  className = "w-full h-screen",
  style: containerStyle,
}: MapExplorerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const pulseRef = useRef<number>(0);
  const [selectedPoint, setSelectedPoint] = useState<DecoderPoint | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [cursorCoords, setCursorCoords] = useState("");
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    archiveNum: string;
    city: string;
    question: string;
  } | null>(null);

  const closeCard = useCallback(() => setSelectedPoint(null), []);

  const flyTo = useCallback((lngLat: [number, number], targetZoom: number) => {
    mapRef.current?.flyTo({ center: lngLat, zoom: targetZoom, duration: 1600, essential: true });
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") closeCard(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeCard]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__mapFlyTo = flyTo;
    return () => { delete (window as unknown as Record<string, unknown>).__mapFlyTo; };
  }, [flyTo]);

  const addPointLayers = useCallback((map: mapboxgl.Map) => {
    if (map.getSource("cultural-points")) return;

    console.log(`[DWL Map] Adding ${points.length} points to map`);
    const validPoints = points.filter((p) => p.lat && p.lng);
    console.log(`[DWL Map] ${validPoints.length} points have valid lat/lng`);
    if (validPoints.length > 0) {
      console.log("[DWL Map] First point coords:", validPoints[0].lat, validPoints[0].lng);
    }

    map.addSource("cultural-points", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: validPoints.map((p) => ({
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
          properties: {
            id: p.id, city: p.city, title: p.title, question: p.question,
            answer: p.answer, category: p.category,
            darija_word: p.darija_word || "", darija_meaning: p.darija_meaning || "",
            darija_literal: p.darija_literal || "", darija_context: p.darija_context || "",
          },
        })),
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Clusters — soft glow, not buttons
    map.addLayer({
      id: "clusters", type: "circle", source: "cultural-points",
      filter: ["has", "point_count"],
      paint: {
        "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
        "circle-color": "#d4a254", "circle-opacity": 0.15,
        "circle-stroke-width": 1, "circle-stroke-color": "#d4a254", "circle-stroke-opacity": 0.3,
      },
    });

    map.addLayer({
      id: "cluster-count", type: "symbol", source: "cultural-points",
      filter: ["has", "point_count"],
      layout: { "text-field": ["get", "point_count_abbreviated"], "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"], "text-size": 10 },
      paint: { "text-color": "#d4a254", "text-opacity": 0.6 },
    });

    // Breathing pulse ring — expands 8→16px and fades over 2600ms
    map.addLayer({
      id: "point-glow", type: "circle", source: "cultural-points",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": 8, "circle-color": "transparent", "circle-opacity": 0,
        "circle-stroke-width": 1.5, "circle-stroke-color": "#d4a254", "circle-stroke-opacity": 0.4,
      },
    });

    // Amber dot — 8px, bright, the most alive thing on screen
    map.addLayer({
      id: "unclustered-point", type: "circle", source: "cultural-points",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": 4, "circle-color": "#d4a254", "circle-opacity": 0.95,
        "circle-stroke-width": 6, "circle-stroke-color": "#d4a254", "circle-stroke-opacity": 0.15,
      },
    });

    // Bright centre — hot core
    map.addLayer({
      id: "unclustered-point-centre", type: "circle", source: "cultural-points",
      filter: ["!", ["has", "point_count"]],
      paint: { "circle-radius": 2, "circle-color": "#f5e6c8", "circle-opacity": 1 },
    });

    // Breathing pulse — ring expands from 8 to 16px, fades as it grows
    const animatePulse = () => {
      if (!map.getLayer("point-glow")) return;
      const t = (Date.now() % 2600) / 2600;
      const radius = 8 + t * 8; // 8px → 16px
      const opacity = 0.4 * (1 - t); // fades to 0 as it expands
      map.setPaintProperty("point-glow", "circle-stroke-opacity", opacity);
      map.setPaintProperty("point-glow", "circle-radius", radius);
      pulseRef.current = requestAnimationFrame(animatePulse);
    };
    pulseRef.current = requestAnimationFrame(animatePulse);
  }, [points]);

  const bindEvents = useCallback((map: mapboxgl.Map) => {
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      if (!features.length) return;
      const clusterId = features[0].properties?.cluster_id;
      const source = map.getSource("cultural-points") as mapboxgl.GeoJSONSource;
      source.getClusterExpansionZoom(clusterId, (err, z) => {
        if (err) return;
        const geom = features[0].geometry;
        if (geom.type === "Point") map.easeTo({ center: geom.coordinates as [number, number], zoom: z || 14 });
      });
    });

    map.on("click", "unclustered-point", (e) => {
      if (!showCard || !e.features?.length) return;
      const props = e.features[0].properties;
      if (!props) return;
      const p = points.find((pt) => pt.id === props.id);
      if (p) { setSelectedPoint(p); setHoverInfo(null); }
    });

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["unclustered-point", "clusters"] });
      if (features.length === 0) setSelectedPoint(null);
    });

    // Hover HUD
    map.on("mouseenter", "unclustered-point", (e) => {
      map.getCanvas().style.cursor = "pointer";
      if (e.features?.length) {
        const props = e.features[0].properties;
        const p = points.find((pt) => pt.id === props?.id);
        if (p) {
          setHoverInfo({
            x: e.point.x, y: e.point.y,
            archiveNum: getArchiveNumber(p), city: p.city,
            question: p.question.length > 80 ? p.question.slice(0, 80) + "..." : p.question,
          });
        }
      }
    });
    map.on("mouseleave", "unclustered-point", () => { map.getCanvas().style.cursor = ""; setHoverInfo(null); });
    map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = ""; });

    if (showCoordinates) {
      map.on("mousemove", (e) => setCursorCoords(formatCoord(e.lngLat.lat, e.lngLat.lng)));
    }
  }, [points, showCard, showCoordinates]);

  useEffect(() => {
    if (!mapContainer.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: STYLES[mapStyle],
      center, zoom,
      maxZoom: 18, minZoom: 1,
      attributionControl: false,
      interactive,
      projection: { name: "mercator" },
    });

    mapRef.current = map;
    map.on("load", () => {
      if (transparent) {
        applyTransparentStyle(map);
      }
      addPointLayers(map);
      bindEvents(map);
    });

    return () => { cancelAnimationFrame(pulseRef.current); map.remove(); };
  }, [points, center, zoom, interactive, showCard, mapStyle, transparent, addPointLayers, bindEvents]);

  const toggleStyle = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const newSat = !isSatellite;
    setIsSatellite(newSat);
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    cancelAnimationFrame(pulseRef.current);
    map.setStyle(newSat ? STYLES.satellite : STYLES[mapStyle]);
    map.once("style.load", () => {
      map.setCenter(currentCenter);
      map.setZoom(currentZoom);
      if (!newSat && transparent) {
        applyTransparentStyle(map);
      }
      addPointLayers(map);
    });
  }, [isSatellite, mapStyle, transparent, addPointLayers]);

  return (
    <div className="relative">
      <div ref={mapContainer} className={className} style={containerStyle} />

      {/* HUD tooltip */}
      {hoverInfo && !selectedPoint && (
        <div
          className="absolute pointer-events-none z-40"
          style={{
            left: hoverInfo.x + 16, top: hoverInfo.y - 10,
            background: "rgba(247,245,240,0.95)", border: "1px solid #e5e2db",
            borderRadius: "4px", padding: "10px 16px", maxWidth: "280px",
            boxShadow: "0 4px 16px rgba(120,100,80,0.1)",
          }}
        >
          <div className="flex items-center" style={{ gap: "10px", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", color: "#c4613a", fontFamily: "monospace" }}>{hoverInfo.archiveNum}</span>
            <span style={{ fontSize: "10px", color: "#9b978f" }}>{hoverInfo.city}</span>
          </div>
          <p style={{ fontSize: "11px", color: "#1a1a1a", opacity: 0.7, lineHeight: "1.4", fontFamily: "monospace" }}>
            {hoverInfo.question}
          </p>
        </div>
      )}

      {/* Coordinates */}
      {showCoordinates && cursorCoords && (
        <div className="absolute z-40 pointer-events-none" style={{ bottom: "16px", left: "16px" }}>
          <span style={{ fontSize: "10px", color: "#6b6860", opacity: 0.5, fontFamily: "monospace" }}>
            {cursorCoords}
          </span>
        </div>
      )}

      {showCard && selectedPoint && <PointCard point={selectedPoint} onClose={closeCard} />}

      {/* Satellite toggle — text only */}
      {showStyleToggle && (
        <button
          onClick={toggleStyle}
          className="absolute z-40 font-sans transition-opacity duration-fast"
          style={{
            bottom: "16px", right: "16px",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "10px", color: "#f5f0e8", opacity: 0.4,
            letterSpacing: "0.05em",
          }}
          title={isSatellite ? "Switch to map" : "Switch to satellite"}
          aria-label="Toggle map style"
        >
          {isSatellite ? "MAP" : "SAT"}
        </button>
      )}
    </div>
  );
}
