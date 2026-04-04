"use client";

import { useEffect, useRef, useState, useCallback, useMemo, CSSProperties } from "react";
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
  const style = map.getStyle();
  if (!style) return;
  style.layers.forEach((layer) => {
    if (layer.id === "background" && layer.type === "background") {
      map.setPaintProperty("background", "background-color", PAGE_BG);
    }
    if (layer.id === "water" || layer.id.startsWith("water")) {
      if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", "#e8e5de");
    }
    if (layer.id.includes("boundary") || layer.id.includes("admin")) {
      if (layer.type === "line") map.setPaintProperty(layer.id, "line-opacity", 0.15);
    }
    if (layer.type === "symbol") map.setPaintProperty(layer.id, "text-opacity", 0.4);
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
  const threadPulseRef = useRef<number>(0);
  const [selectedPoint, setSelectedPoint] = useState<DecoderPoint | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [manualSatellite, setManualSatellite] = useState<boolean | null>(null);
  const [cursorCoords, setCursorCoords] = useState("");
  const [hoverInfo, setHoverInfo] = useState<{
    x: number; y: number; archiveNum: string; city: string; question: string;
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

  // Build thread line data from points sharing the same trail
  const threadLines = useMemo(() => {
    const trailGroups: Record<string, DecoderPoint[]> = {};
    points.forEach((p) => {
      if (p.trail) {
        if (!trailGroups[p.trail]) trailGroups[p.trail] = [];
        trailGroups[p.trail].push(p);
      }
    });
    const features: GeoJSON.Feature[] = [];
    Object.values(trailGroups).forEach((group) => {
      for (let i = 0; i < group.length - 1; i++) {
        features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [group[i].lng, group[i].lat],
              [group[i + 1].lng, group[i + 1].lat],
            ],
          },
          properties: { trail: group[i].trail },
        });
      }
    });
    return { type: "FeatureCollection" as const, features };
  }, [points]);

  const addPointLayers = useCallback((map: mapboxgl.Map) => {
    if (map.getSource("cultural-points")) return;

    const validPoints = points.filter((p) => p.lat && p.lng);

    // === POINTS SOURCE ===
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
      clusterMaxZoom: 6,
      clusterRadius: 50,
    });

    // === THREAD LINES SOURCE ===
    map.addSource("thread-lines", {
      type: "geojson",
      data: threadLines,
    });

    // === ZOOM 1-3: CLUSTERS ONLY ===
    map.addLayer({
      id: "clusters", type: "circle", source: "cultural-points",
      filter: ["has", "point_count"],
      paint: {
        "circle-radius": ["step", ["get", "point_count"], 12, 10, 18, 30, 24],
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

    // === ZOOM 4+: THREAD LINES (faint at 4-6, stronger at 7+) ===
    map.addLayer({
      id: "thread-lines-bg", type: "line", source: "thread-lines",
      minzoom: 4,
      paint: {
        "line-color": "#d4a254",
        "line-width": 1,
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 4, 0.08, 7, 0.2, 10, 0.35],
      },
      layout: { "line-cap": "round" },
    });
    // Animated dash overlay — the "data pulse" travelling along threads
    map.addLayer({
      id: "thread-lines-pulse", type: "line", source: "thread-lines",
      minzoom: 4,
      paint: {
        "line-color": "#d4a254",
        "line-width": 2,
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 4, 0.1, 7, 0.3, 10, 0.5],
        "line-dasharray": [0, 4, 3],
      },
      layout: { "line-cap": "round" },
    });

    // === ZOOM 4+: INDIVIDUAL DOTS ===
    // Breathing pulse ring
    map.addLayer({
      id: "point-glow", type: "circle", source: "cultural-points",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": 8, "circle-color": "transparent", "circle-opacity": 0,
        "circle-stroke-width": 1.5, "circle-stroke-color": "#d4a254", "circle-stroke-opacity": 0.4,
      },
    });
    // Main dot
    map.addLayer({
      id: "unclustered-point", type: "circle", source: "cultural-points",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 2, 3, 7, 4, 11, 6],
        "circle-color": "#d4a254", "circle-opacity": 0.95,
        "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 2, 3, 7, 6, 11, 8],
        "circle-stroke-color": "#d4a254", "circle-stroke-opacity": 0.15,
      },
    });
    // Hot centre
    map.addLayer({
      id: "unclustered-point-centre", type: "circle", source: "cultural-points",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 2, 1.5, 7, 2, 11, 3],
        "circle-color": "#f5e6c8", "circle-opacity": 1,
      },
    });

    // === ZOOM 7+: TITLE LABELS beside dots ===
    map.addLayer({
      id: "point-labels", type: "symbol", source: "cultural-points",
      filter: ["!", ["has", "point_count"]],
      minzoom: 7,
      layout: {
        "text-field": ["get", "title"],
        "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 7, 9, 11, 11],
        "text-offset": [1, 0],
        "text-anchor": "left",
        "text-max-width": 12,
      },
      paint: {
        "text-color": "#f5f0e8",
        "text-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0.3, 9, 0.5, 11, 0.7],
        "text-halo-color": "#111111",
        "text-halo-width": 1,
      },
    });

    // === ZOOM 11+: QUESTION TEXT below title ===
    map.addLayer({
      id: "point-questions", type: "symbol", source: "cultural-points",
      filter: ["!", ["has", "point_count"]],
      minzoom: 11,
      layout: {
        "text-field": ["get", "question"],
        "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"],
        "text-size": 9,
        "text-offset": [1, 1.5],
        "text-anchor": "left",
        "text-max-width": 18,
      },
      paint: {
        "text-color": "#f5f0e8",
        "text-opacity": 0.4,
        "text-halo-color": "#111111",
        "text-halo-width": 1,
      },
    });

    // === ANIMATIONS ===
    // Dot pulse
    const animatePulse = () => {
      if (!map.getLayer("point-glow")) return;
      const t = (Date.now() % 2600) / 2600;
      const radius = 8 + t * 8;
      const opacity = 0.4 * (1 - t);
      map.setPaintProperty("point-glow", "circle-stroke-opacity", opacity);
      map.setPaintProperty("point-glow", "circle-radius", radius);
      pulseRef.current = requestAnimationFrame(animatePulse);
    };
    pulseRef.current = requestAnimationFrame(animatePulse);

    // Thread line pulse — dash offset animates to create data-travelling effect
    let dashStep = 0;
    const animateThreads = () => {
      if (!map.getLayer("thread-lines-pulse")) return;
      dashStep = (dashStep + 0.15) % 7;
      map.setPaintProperty("thread-lines-pulse", "line-dasharray", [
        0, 4 + dashStep, 3 - Math.min(dashStep, 2.5),
      ]);
      threadPulseRef.current = requestAnimationFrame(animateThreads);
    };
    threadPulseRef.current = requestAnimationFrame(animateThreads);
  }, [points, threadLines]);

  const bindEvents = useCallback((map: mapboxgl.Map) => {
    // Cluster click → zoom
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      if (!features.length) return;
      const clusterId = features[0].properties?.cluster_id;
      const source = map.getSource("cultural-points") as mapboxgl.GeoJSONSource;
      source.getClusterExpansionZoom(clusterId, (err, z) => {
        if (err) return;
        const geom = features[0].geometry;
        if (geom.type === "Point") map.easeTo({ center: geom.coordinates as [number, number], zoom: z || 7 });
      });
    });

    // Dot click → card
    map.on("click", "unclustered-point", (e) => {
      if (!showCard || !e.features?.length) return;
      const props = e.features[0].properties;
      if (!props) return;
      const p = points.find((pt) => pt.id === props.id);
      if (p) { setSelectedPoint(p); setHoverInfo(null); }
    });

    // Background click → close
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

    // Live coordinates
    if (showCoordinates) {
      map.on("mousemove", (e) => setCursorCoords(formatCoord(e.lngLat.lat, e.lngLat.lng)));
    }

    // === AUTO-SATELLITE at zoom 11+ ===
    map.on("zoomend", () => {
      const z = map.getZoom();
      if (manualSatellite !== null) return; // user manually toggled, don't override
      if (z >= 11 && !isSatellite) {
        setIsSatellite(true);
        const c = map.getCenter();
        cancelAnimationFrame(pulseRef.current);
        cancelAnimationFrame(threadPulseRef.current);
        map.setStyle(STYLES.satellite);
        map.once("style.load", () => {
          map.setCenter(c);
          map.setZoom(z);
          addPointLayers(map);
        });
      } else if (z < 11 && isSatellite && manualSatellite === null) {
        setIsSatellite(false);
        const c = map.getCenter();
        cancelAnimationFrame(pulseRef.current);
        cancelAnimationFrame(threadPulseRef.current);
        map.setStyle(STYLES[mapStyle]);
        map.once("style.load", () => {
          map.setCenter(c);
          map.setZoom(z);
          if (transparent) applyTransparentStyle(map);
          addPointLayers(map);
        });
      }
    });
  }, [points, showCard, showCoordinates, isSatellite, manualSatellite, mapStyle, transparent, addPointLayers]);

  // Init map
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
      if (transparent) applyTransparentStyle(map);
      addPointLayers(map);
      bindEvents(map);
    });

    return () => {
      cancelAnimationFrame(pulseRef.current);
      cancelAnimationFrame(threadPulseRef.current);
      map.remove();
    };
  }, [points, center, zoom, interactive, showCard, mapStyle, transparent, addPointLayers, bindEvents]);

  // Manual toggle
  const toggleStyle = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const newSat = !isSatellite;
    setIsSatellite(newSat);
    setManualSatellite(newSat);
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    cancelAnimationFrame(pulseRef.current);
    cancelAnimationFrame(threadPulseRef.current);
    map.setStyle(newSat ? STYLES.satellite : STYLES[mapStyle]);
    map.once("style.load", () => {
      map.setCenter(currentCenter);
      map.setZoom(currentZoom);
      if (!newSat && transparent) applyTransparentStyle(map);
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
            background: "rgba(17,17,17,0.88)", border: "1px solid rgba(212,162,84,0.15)",
            borderRadius: "4px", padding: "10px 16px", maxWidth: "280px",
          }}
        >
          <div className="flex items-center" style={{ gap: "10px", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", color: "#d4a254", fontFamily: "monospace" }}>{hoverInfo.archiveNum}</span>
            <span style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.4 }}>{hoverInfo.city}</span>
          </div>
          <p style={{ fontSize: "11px", color: "#f5f0e8", opacity: 0.7, lineHeight: "1.4", fontFamily: "monospace" }}>
            {hoverInfo.question}
          </p>
        </div>
      )}

      {/* Coordinates */}
      {showCoordinates && cursorCoords && (
        <div className="absolute z-40 pointer-events-none" style={{ bottom: "16px", left: "16px" }}>
          <span style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.35, fontFamily: "monospace" }}>
            {cursorCoords}
          </span>
        </div>
      )}

      {showCard && selectedPoint && <PointCard point={selectedPoint} onClose={closeCard} />}

      {/* SAT / MAP toggle */}
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
        >
          {isSatellite ? "MAP" : "SAT"}
        </button>
      )}
    </div>
  );
}
