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
  className?: string;
}

export default function MapExplorer({
  points,
  center = [20, 15],
  zoom = 2,
  interactive = true,
  showCard = true,
  showStyleToggle = false,
  className = "w-full h-screen",
}: MapExplorerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DecoderPoint | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  const closeCard = useCallback(() => setSelectedPoint(null), []);

  const flyTo = useCallback((lngLat: [number, number], targetZoom: number) => {
    mapRef.current?.flyTo({
      center: lngLat,
      zoom: targetZoom,
      duration: 1600,
      essential: true,
    });
  }, []);

  // ESC to close card
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCard();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeCard]);

  // Expose flyTo for parent
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__mapFlyTo = flyTo;
    return () => {
      delete (window as unknown as Record<string, unknown>).__mapFlyTo;
    };
  }, [flyTo]);

  // Add source and layers to map
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
    },
    [points]
  );

  // Bind click/cursor events
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
        if (point) setSelectedPoint(point);
      });

      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["unclustered-point", "clusters"] });
        if (features.length === 0) setSelectedPoint(null);
      });

      map.on("mouseenter", "unclustered-point", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "unclustered-point", () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = ""; });
    },
    [points, showCard]
  );

  // Initialize map
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
      map.remove();
    };
  }, [points, center, zoom, interactive, showCard, addPointLayers, bindEvents]);

  // Toggle map style
  const toggleStyle = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const newSatellite = !isSatellite;
    setIsSatellite(newSatellite);

    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    const newStyle = newSatellite ? STYLE_SATELLITE : STYLE_DARK;

    map.setStyle(newStyle);

    map.once("style.load", () => {
      map.setCenter(currentCenter);
      map.setZoom(currentZoom);
      addPointLayers(map);
    });
  }, [isSatellite, addPointLayers]);

  return (
    <div className="relative">
      <div ref={mapContainer} className={className} />

      {showCard && selectedPoint && (
        <PointCard point={selectedPoint} onClose={closeCard} />
      )}

      {/* Style toggle — eye icon, bottom right */}
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
          title={isSatellite ? "Switch to dark view" : "Switch to satellite view"}
          aria-label="Toggle map style"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isSatellite ? "#d4a254" : "#9b978f"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      )}
    </div>
  );
}
