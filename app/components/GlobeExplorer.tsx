"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { DecoderPoint } from "@/app/lib/supabase";
import PointCard from "./PointCard";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const DARK_TEXTURE = "//unpkg.com/three-globe/example/img/earth-night.jpg";
const SATELLITE_TEXTURE = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_TEXTURE = "//unpkg.com/three-globe/example/img/earth-topology.png";

interface GlobeExplorerProps {
  points: DecoderPoint[];
  showCard?: boolean;
  showStyleToggle?: boolean;
  showCoordinates?: boolean;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
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

export default function GlobeExplorer({
  points,
  showCard = true,
  showStyleToggle = false,
  showCoordinates = false,
}: GlobeExplorerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [autoRotate, setAutoRotate] = useState(true);

  // Set dimensions on mount
  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset idle timer on interaction
  const resetIdleTimer = useCallback(() => {
    setAutoRotate(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setAutoRotate(true), 10000);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("mousedown", resetIdleTimer);
    window.addEventListener("wheel", resetIdleTimer);
    window.addEventListener("touchstart", resetIdleTimer);
    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("mousedown", resetIdleTimer);
      window.removeEventListener("wheel", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Configure globe on mount
  useEffect(() => {
    if (!globeRef.current) return;
    const globe = globeRef.current;

    // Initial POV: show Morocco region
    globe.pointOfView({ lat: 25, lng: 10, altitude: 2.5 }, 0);

    // Atmosphere
    const controls = globe.controls();
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 0.8;
    }
  }, []);

  // Auto-rotation speed
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 0.3;
    }
  }, [autoRotate]);

  const closeCard = useCallback(() => setSelectedPoint(null), []);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCard();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeCard]);

  // Expose flyTo for search
  useEffect(() => {
    const flyTo = (lngLat: [number, number]) => {
      if (globeRef.current) {
        globeRef.current.pointOfView(
          { lat: lngLat[1], lng: lngLat[0], altitude: 0.5 },
          1600
        );
      }
    };
    (window as unknown as Record<string, unknown>).__mapFlyTo = flyTo;
    return () => {
      delete (window as unknown as Record<string, unknown>).__mapFlyTo;
    };
  }, []);

  // Build arc data from points that share the same trail
  const arcs = useMemo<ArcData[]>(() => {
    const trailGroups: Record<string, DecoderPoint[]> = {};
    points.forEach((p) => {
      if (p.trail) {
        if (!trailGroups[p.trail]) trailGroups[p.trail] = [];
        trailGroups[p.trail].push(p);
      }
    });

    const result: ArcData[] = [];
    Object.values(trailGroups).forEach((group) => {
      for (let i = 0; i < group.length - 1; i++) {
        result.push({
          startLat: group[i].lat,
          startLng: group[i].lng,
          endLat: group[i + 1].lat,
          endLng: group[i + 1].lng,
          color: "#d4a254",
        });
      }
    });
    return result;
  }, [points]);

  // Point data for globe
  const pointData = useMemo(
    () =>
      points.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        size: 0.12,
        color: "#d4a254",
        id: p.id,
        point: p,
      })),
    [points]
  );

  const handlePointClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pointObj: Record<string, any>) => {
      if (!showCard) return;
      const p = points.find((pt) => pt.id === pointObj.id);
      if (p) {
        setSelectedPoint(p);
        setHoverInfo(null);
        if (globeRef.current) {
          globeRef.current.pointOfView(
            { lat: p.lat, lng: p.lng, altitude: 0.8 },
            1600
          );
        }
      }
    },
    [points, showCard]
  );

  const handlePointHover = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pointObj: Record<string, any> | null) => {
      if (!pointObj) {
        setHoverInfo(null);
        return;
      }
      const p = points.find((pt) => pt.id === pointObj.id);
      if (p) {
        // Approximate screen position from center (simplified)
        setHoverInfo({
          x: dimensions.width / 2,
          y: dimensions.height / 2 - 60,
          archiveNum: getArchiveNumber(p),
          city: p.city,
          question:
            p.question.length > 80
              ? p.question.slice(0, 80) + "..."
              : p.question,
        });
        if (showCoordinates) {
          setCursorCoords(formatCoord(p.lat, p.lng));
        }
      }
    },
    [points, dimensions, showCoordinates]
  );

  const toggleStyle = useCallback(() => {
    setIsSatellite((prev) => !prev);
  }, []);

  if (dimensions.width === 0) return null;

  return (
    <div className="relative w-full h-screen" style={{ background: "#111111" }}>
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={isSatellite ? SATELLITE_TEXTURE : DARK_TEXTURE}
        bumpImageUrl={BUMP_TEXTURE}
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#d4a254"
        atmosphereAltitude={0.15}
        pointsData={pointData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointsMerge={false}
        onPointClick={handlePointClick}
        onPointHover={handlePointHover}
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcAltitudeAutoScale={0.3}
        arcStroke={0.5}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2600}
      />

      {/* HUD hover tooltip */}
      {hoverInfo && !selectedPoint && (
        <div
          className="fixed pointer-events-none z-40"
          style={{
            left: "50%",
            top: "38.2%",
            transform: "translate(-50%, -100%)",
            background: "rgba(17,17,17,0.92)",
            border: "1px solid #2a2a2a",
            borderRadius: "4px",
            padding: "10px 16px",
            maxWidth: "280px",
          }}
        >
          <div className="flex items-center" style={{ gap: "10px", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", color: "#d4a254", fontFamily: "monospace" }}>
              {hoverInfo.archiveNum}
            </span>
            <span style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.4 }}>
              {hoverInfo.city}
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "#f5f0e8", opacity: 0.7, lineHeight: "1.4", fontFamily: "monospace" }}>
            {hoverInfo.question}
          </p>
        </div>
      )}

      {/* Cursor coordinates */}
      {showCoordinates && cursorCoords && (
        <div className="fixed z-40 pointer-events-none" style={{ bottom: "26px", left: "26px" }}>
          <span style={{ fontSize: "10px", color: "#f5f0e8", opacity: 0.35, fontFamily: "monospace", letterSpacing: "0.05em" }}>
            {cursorCoords}
          </span>
        </div>
      )}

      {/* Card */}
      {showCard && selectedPoint && (
        <PointCard point={selectedPoint} onClose={closeCard} />
      )}

      {/* Satellite toggle */}
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
          aria-label="Toggle globe texture"
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
