"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DecoderPoint } from "@/app/lib/supabase";
import PointCard from "./PointCard";

const STYLE_DARK = "mapbox://styles/mapbox/dark-v11";
const STYLE_SATELLITE = "mapbox://styles/mapbox/satellite-v9";

interface MapExplorerProps {
  points: DecoderPoint[];
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  showCard?: boolean;
  showStyleToggle?: boolean;
  showCoordinates?: boolean;
  className?: string;
}

function getArchiveNumber(point: DecoderPoint): string {
  const code = "MA";
  const num = point.id.replace(/[^0-9]/g, "").slice(-3).padStart(3, "0");
  return `${code}-${num}`;
}

function formatCoord(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

export default function MapExplorer({
  points,
  center = [20, 15],
  zoom = 2,
  interactive = true,
  showCard = true,
  showStyleToggle = false,
  showCoordinates = false,
  className = "w-full h-screen",
}: MapExplorerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const sonarFrameRef = useRef<number>(0);
  const [selectedPoint, setSelectedPoint] = useState<DecoderPoint | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<string>("");
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    archiveNum: string;
    city: string;
    question: string;
  } | null>(null);

  const closeCard = useCallback(() => setSelectedPoint(null), []);

  const flyTo = useCallback((lngLat: [number, number], targetZoom: number) => {
    mapRef.current?.flyTo({
      center: lngLat,
      zoom: targetZoom,
      duration: 1600,
      essential: true,
    });
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCard();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeCard]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__mapFlyTo = flyTo;
    return () => {
      delete (window as unknown as Record<string, unknown>).__mapFlyTo;
    };
  }, [flyTo]);

  const addPointLayers = useCallback(
    (map: mapboxgl.Map) => {
      if (map.getSource("cultural-points")) return;

      map.addSource("cultural-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: points.map((p) => ({
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
            properties: {
              id: p.id,
              city: p.city,
              title: p.title,
              question: p.question,
              answer: p.answer,
              category: p.category,
              darija_word: p.darija_word || "",
              darija_meaning: p.darija_meaning || "",
              darija_literal: p.darija_literal || "",
              darija_context: p.darija_context || "",
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster circles
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "cultural-points",
        filter: ["has", "point_count"],
        paint: {
          "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
          "circle-color": "#d4a254",
          "circle-opacity": 0.3,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#d4a254",
          "circle-stroke-opacity": 0.5,
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "cultural-points",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: { "text-color": "#f5f0e8" },
      });

      // Sonar ring layer — animated via JS
      map.addLayer({
        id: "sonar-ring",
        type: "circle",
        source: "cultural-points",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 12,
          "circle-color": "transparent",
          "circle-opacity": 0,
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#d4a254",
          "circle-stroke-opacity": 0.3,
        },
      });

      // Unclustered point glow
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "cultural-points",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 6,
          "circle-color": "#d4a254",
          "circle-opacity": 0.9,
          "circle-stroke-width": 8,
          "circle-stroke-color": "#d4a254",
          "circle-stroke-opacity": 0.15,
        },
      });

      // Bright centre
      map.addLayer({
        id: "unclustered-point-centre",
        type: "circle",
        source: "cultural-points",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 3,
          "circle-color": "#f5e6c8",
          "circle-opacity": 1,
        },
      });

      // Animate sonar ring
      const animateSonar = () => {
        if (!map.getLayer("sonar-ring")) return;
        const t = (Date.now() % 2600) / 2600; // 0-1 over 2600ms cycle
        const radius = 8 + t * 18; // 8px → 26px
        const opacity = 0.4 * (1 - t); // fades out as it expands
        map.setPaintProperty("sonar-ring", "circle-stroke-opacity", opacity);
        map.setPaintProperty("sonar-ring", "circle-radius", radius);
        sonarFrameRef.current = requestAnimationFrame(animateSonar);
      };
      sonarFrameRef.current = requestAnimationFrame(animateSonar);
    },
    [points]
  );

  const bindEvents = useCallback(
    (map: mapboxgl.Map) => {
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        if (!features.length) return;
        const clusterId = features[0].properties?.cluster_id;
        const source = map.getSource("cultural-points") as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, expansionZoom) => {
          if (err) return;
          const geom = features[0].geometry;
          if (geom.type === "Point") {
            map.easeTo({ center: geom.coordinates as [number, number], zoom: expansionZoom || 14 });
          }
        });
      });

      map.on("click", "unclustered-point", (e) => {
        if (!showCard || !e.features?.length) return;
        const props = e.features[0].properties;
        if (!props) return;
        const point = points.find((p) => p.id === props.id);
        if (point) {
          setSelectedPoint(point);
          setHoverInfo(null);
        }
      });

      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["unclustered-point", "clusters"] });
        if (features.length === 0) setSelectedPoint(null);
      });

      // Hover HUD tooltip
      map.on("mouseenter", "unclustered-point", (e) => {
        map.getCanvas().style.cursor = "pointer";
        if (e.features?.length) {
          const props = e.features[0].properties;
          const point = points.find((p) => p.id === props?.id);
          if (point) {
            setHoverInfo({
              x: e.point.x,
              y: e.point.y,
              archiveNum: getArchiveNumber(point),
              city: point.city,
              question: point.question.length > 80
                ? point.question.slice(0, 80) + "..."
                : point.question,
            });
          }
        }
      });

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
        setHoverInfo(null);
      });

      map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = ""; });

      // Live cursor coordinates
      if (showCoordinates) {
        map.on("mousemove", (e) => {
          setCursorCoords(formatCoord(e.lngLat.lat, e.lngLat.lng));
        });
      }
    },
    [points, showCard, showCoordinates]
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: STYLE_DARK,
      center,
      zoom,
      maxZoom: 18,
      minZoom: 2,
      attributionControl: false,
      interactive,
    });

    mapRef.current = map;

    map.on("load", () => {
      addPointLayers(map);
      bindEvents(map);
    });

    return () => {
      cancelAnimationFrame(sonarFrameRef.current);
      map.remove();
    };
  }, [points, center, zoom, interactive, showCard, addPointLayers, bindEvents]);

  const toggleStyle = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const newSatellite = !isSatellite;
    setIsSatellite(newSatellite);

    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    cancelAnimationFrame(sonarFrameRef.current);
    map.setStyle(newSatellite ? STYLE_SATELLITE : STYLE_DARK);

    map.once("style.load", () => {
      map.setCenter(currentCenter);
      map.setZoom(currentZoom);
      addPointLayers(map);
    });
  }, [isSatellite, addPointLayers]);

  return (
    <div className="relative">
      <div ref={mapContainer} className={className} />

      {/* HUD hover tooltip */}
      {hoverInfo && !selectedPoint && (
        <div
          className="fixed pointer-events-none z-40"
          style={{
            left: hoverInfo.x + 16,
            top: hoverInfo.y - 10,
            background: "rgba(17,17,17,0.92)",
            border: "1px solid #2a2a2a",
            borderRadius: "4px",
            padding: "10px 16px",
            maxWidth: "280px",
          }}
        >
          <div className="flex items-center" style={{ gap: "10px", marginBottom: "4px" }}>
            <span className="font-sans" style={{ fontSize: "10px", color: "#d4a254", fontFamily: "monospace" }}>
              {hoverInfo.archiveNum}
            </span>
            <span className="font-sans" style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.4 }}>
              {hoverInfo.city}
            </span>
          </div>
          <p className="font-sans" style={{ fontSize: "11px", color: "#f5f0e8", opacity: 0.7, lineHeight: "1.4" }}>
            {hoverInfo.question}
          </p>
        </div>
      )}

      {/* Cursor coordinates — GPS readout */}
      {showCoordinates && cursorCoords && (
        <div className="fixed z-40 pointer-events-none" style={{ bottom: "26px", left: "26px" }}>
          <span style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.35, fontFamily: "monospace", letterSpacing: "0.05em" }}>
            {cursorCoords}
          </span>
        </div>
      )}

      {showCard && selectedPoint && (
        <PointCard point={selectedPoint} onClose={closeCard} />
      )}

      {/* Satellite toggle — eye icon */}
      {showStyleToggle && (
        <button
          onClick={toggleStyle}
          className="fixed z-40 transition-opacity duration-fast"
          style={{
            bottom: "26px",
            right: "26px",
            width: "32px",
            height: "32px",
            background: "none",
            border: "none",
            cursor: "pointer",
            opacity: isSatellite ? 0.9 : 0.4,
          }}
          title={isSatellite ? "Dark view" : "Satellite view"}
          aria-label="Toggle map style"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isSatellite ? "#d4a254" : "#9b978f"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      )}
    </div>
  );
}
