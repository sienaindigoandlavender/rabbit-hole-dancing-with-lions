"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DecoderPoint } from "@/app/lib/supabase";
import { MAP_CONFIG, applyCustomStyle } from "@/app/lib/mapStyle";
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
  center = MAP_CONFIG.defaultCenter,
  zoom = MAP_CONFIG.defaultZoom,
  interactive = true,
  showCard = true,
  className = "w-full h-screen",
}: MapExplorerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DecoderPoint | null>(null);

  const flyToCity = useCallback(
    (lat: number, lng: number) => {
      map.current?.flyTo({
        center: [lng, lat],
        zoom: 12,
        duration: 2000,
        essential: true,
      });
    },
    []
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_CONFIG.style,
      center: center,
      zoom: zoom,
      maxZoom: MAP_CONFIG.maxZoom,
      minZoom: MAP_CONFIG.minZoom,
      attributionControl: true,
      interactive: interactive,
    });

    map.current = mapInstance;

    applyCustomStyle(mapInstance);

    mapInstance.on("load", () => {
      // Add point source as GeoJSON for clustering
      mapInstance.addSource("points", {
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
              title: p.title,
              category: p.category,
              city: p.city,
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });

      // Cluster circles
      mapInstance.addLayer({
        id: "clusters",
        type: "circle",
        source: "points",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#d4a254",
          "circle-radius": [
            "step",
            ["get", "point_count"],
            16,
            10,
            22,
            30,
            28,
          ],
          "circle-opacity": 0.6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#d4a254",
          "circle-stroke-opacity": 0.3,
        },
      });

      // Cluster count labels
      mapInstance.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "points",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#111111",
        },
      });

      // Click cluster to zoom
      mapInstance.on("click", "clusters", (e) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features.length) return;
        const clusterId = features[0].properties?.cluster_id;
        const source = mapInstance.getSource("points") as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoomLevel) => {
          if (err) return;
          const geometry = features[0].geometry;
          if (geometry.type === "Point") {
            mapInstance.easeTo({
              center: geometry.coordinates as [number, number],
              zoom: zoomLevel || 12,
            });
          }
        });
      });

      // Cursor pointer on clusters
      mapInstance.on("mouseenter", "clusters", () => {
        mapInstance.getCanvas().style.cursor = "pointer";
      });
      mapInstance.on("mouseleave", "clusters", () => {
        mapInstance.getCanvas().style.cursor = "";
      });
    });

    const updateMarkers = () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      points.forEach((point) => {
        const el = document.createElement("div");
        el.className = "marker-pulse";
        el.style.width = "10px";
        el.style.height = "10px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#d4a254";
        el.style.boxShadow = "0 0 8px 3px rgba(212, 162, 84, 0.5)";
        el.style.cursor = "pointer";
        el.style.transition = "all 0.2s ease";

        el.addEventListener("mouseenter", () => {
          el.style.width = "14px";
          el.style.height = "14px";
          el.style.boxShadow = "0 0 12px 5px rgba(212, 162, 84, 0.8)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.width = "10px";
          el.style.height = "10px";
          el.style.boxShadow = "0 0 8px 3px rgba(212, 162, 84, 0.5)";
        });

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (showCard) {
            setSelectedPoint(point);
          }
          mapInstance.flyTo({
            center: [point.lng, point.lat],
            zoom: Math.max(mapInstance.getZoom(), 13),
            duration: 1000,
          });
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([point.lng, point.lat])
          .addTo(mapInstance);

        markersRef.current.push(marker);
      });
    };

    mapInstance.on("load", updateMarkers);

    return () => {
      markersRef.current.forEach((m) => m.remove());
      mapInstance.remove();
    };
  }, [points, center, zoom, interactive, showCard]);

  // Expose flyToCity for parent components
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__mapFlyTo = flyToCity;
    return () => {
      delete (window as unknown as Record<string, unknown>).__mapFlyTo;
    };
  }, [flyToCity]);

  return (
    <div className="relative">
      <div ref={mapContainer} className={className} />
      {showCard && selectedPoint && (
        <PointCard
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
        />
      )}
    </div>
  );
}
