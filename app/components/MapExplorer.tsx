"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DecoderPoint } from "@/app/lib/supabase";
import PointCard from "./PointCard";

interface MapExplorerProps {
  points: DecoderPoint[];
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  showCard?: boolean;
  className?: string;
}

export default function MapExplorer({
  points,
  center = [-6.5, 32.5],
  zoom = 5.5,
  interactive = true,
  showCard = true,
  className = "w-full h-screen",
}: MapExplorerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DecoderPoint | null>(null);

  const closeCard = useCallback(() => setSelectedPoint(null), []);

  const flyTo = useCallback((lngLat: [number, number], targetZoom: number) => {
    mapRef.current?.flyTo({
      center: lngLat,
      zoom: targetZoom,
      duration: 2000,
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

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom,
      maxZoom: 18,
      minZoom: 2,
      attributionControl: false,
      interactive,
    });

    mapRef.current = map;

    map.on("load", () => {
      // GeoJSON source with clustering
      map.addSource("cultural-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: points.map((p) => ({
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [p.lng, p.lat],
            },
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
          "circle-radius": [
            "step",
            ["get", "point_count"],
            15,
            10,
            20,
            30,
            25,
          ],
          "circle-color": "#d4a254",
          "circle-opacity": 0.3,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#d4a254",
          "circle-stroke-opacity": 0.5,
        },
      });

      // Cluster count labels
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
        paint: {
          "text-color": "#f5f0e8",
        },
      });

      // Unclustered point glow (outer stroke)
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

      // Unclustered point bright centre
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

      // Click cluster → zoom in
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features.length) return;
        const clusterId = features[0].properties?.cluster_id;
        const source = map.getSource(
          "cultural-points"
        ) as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, expansionZoom) => {
          if (err) return;
          const geom = features[0].geometry;
          if (geom.type === "Point") {
            map.easeTo({
              center: geom.coordinates as [number, number],
              zoom: expansionZoom || 14,
            });
          }
        });
      });

      // Click unclustered point → show card
      map.on("click", "unclustered-point", (e) => {
        if (!showCard || !e.features?.length) return;
        const props = e.features[0].properties;
        if (!props) return;

        // Find the full point data to pass to card
        const point = points.find((p) => p.id === props.id);
        if (point) {
          setSelectedPoint(point);
        }
      });

      // Click map background → close card
      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["unclustered-point", "clusters"],
        });
        if (features.length === 0) {
          setSelectedPoint(null);
        }
      });

      // Cursors
      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });
      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.remove();
    };
  }, [points, center, zoom, interactive, showCard]);

  return (
    <div className="relative">
      <div ref={mapContainer} className={className} />
      {showCard && selectedPoint && (
        <PointCard point={selectedPoint} onClose={closeCard} />
      )}
    </div>
  );
}
