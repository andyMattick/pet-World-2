import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  WORLD_CONTINENTS, 
  FAMOUS_RIVERS, 
  COMPASS_HUBS, 
  projectLatLng, 
  unprojectXY, 
  calculateDistanceNauticalMiles,
  calculateBearing 
} from '../data/worldMap';
import { SEA_NODES, SEA_CONNECTIONS } from '../data/navigationRoutes';
import { CLIMATE_ZONES } from '../data/weather';
import { ExpeditionShip, RegionPOI, CrownNation } from '../types';
import { SoundEngine } from '../utils/audio';
import { Compass, Ship, Anchor, Search, ZoomIn, ZoomOut, RotateCcw, CloudSun, Wind } from 'lucide-react';

interface NauticalMapProps {
  playerNation: CrownNation;
  ships: ExpeditionShip[];
  regions: RegionPOI[];
  selectedShipId?: string;
  onSelectShip: (shipId: string) => void;
  onSelectRegion: (region: RegionPOI) => void;
  onOrderShipToTarget: (shipId: string, targetCoords: [number, number], targetName: string) => void;
  activeMysteryCoords?: [number, number];
  onInvestigateMystery?: (coords: [number, number]) => void;
  isNight?: boolean;
  onOpenCelestialModal?: (shipId: string) => void;
}

export const NauticalMap: React.FC<NauticalMapProps> = ({
  playerNation,
  ships,
  regions,
  selectedShipId,
  onSelectShip,
  onSelectRegion,
  onOrderShipToTarget,
  activeMysteryCoords,
  onInvestigateMystery,
  isNight = false,
  onOpenCelestialModal
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport transform state
  const [zoom, setZoom] = useState<number>(1.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: -150, y: -80 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<RegionPOI | null>(null);
  const [showWeather, setShowWeather] = useState<boolean>(true);

  // Base canvas coordinate dimensions
  const MAP_BASE_WIDTH = 2000;
  const MAP_BASE_HEIGHT = 1200;

  // Open (and reset) on the North Atlantic, so a phone screen starts with Europe, Africa and the Americas' coast in view
  const centerView = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth || 800, h = el.clientHeight || 600;
    const z = w < 640 ? 0.8 : 1.2;
    const pt = projectLatLng(28, -38, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
    setZoom(z);
    setPan({ x: w / 2 - pt.x * z, y: h / 2 - pt.y * z });
  }, []);
  useEffect(() => { centerView(); }, [centerView]);

  // Selected ship helper
  const selectedShip = ships.find(s => s.id === selectedShipId);

  // Render the entire map onto Canvas
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply pan and zoom
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // 1. Ocean Background (Aged Vellum Parchment Tint or Nocturnal Starlight Sea)
    const oceanGrad = ctx.createRadialGradient(
      MAP_BASE_WIDTH / 2, MAP_BASE_HEIGHT / 2, 200,
      MAP_BASE_WIDTH / 2, MAP_BASE_HEIGHT / 2, MAP_BASE_WIDTH
    );
    if (isNight) {
      oceanGrad.addColorStop(0, '#151C2C');
      oceanGrad.addColorStop(0.6, '#0E1420');
      oceanGrad.addColorStop(1, '#080A10');
    } else {
      oceanGrad.addColorStop(0, '#EAE1CE');
      oceanGrad.addColorStop(0.6, '#DFD4BE');
      oceanGrad.addColorStop(1, '#CEBF9E');
    }
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);

    // Starlight accents across ocean during night hours
    if (isNight) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      const nightStars: [number, number][] = [
        [350, 180], [550, 120], [850, 310], [1250, 160], [1550, 220], [1850, 140],
        [420, 680], [720, 840], [1120, 910], [1420, 770], [1720, 880], [920, 540],
        [620, 420], [1300, 480], [250, 820], [1650, 620]
      ];
      nightStars.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 2. Graticules (Latitude & Longitude grid lines)
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    // Longitude lines every 30 degrees
    for (let lng = -180; lng <= 180; lng += 30) {
      const p1 = projectLatLng(80, lng, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      const p2 = projectLatLng(-70, lng, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Latitude lines (Equator highlighted in subtle gold, tropics)
    for (let lat = -60; lat <= 80; lat += 20) {
      const pLeft = projectLatLng(lat, -180, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      const pRight = projectLatLng(lat, 180, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      ctx.beginPath();
      if (lat === 0) {
        ctx.strokeStyle = 'rgba(180, 83, 9, 0.35)'; // Equator
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
      } else if (lat === 23.5 || lat === -23.5) {
        ctx.strokeStyle = 'rgba(146, 64, 14, 0.22)'; // Tropics
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
      } else {
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.08)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 4]);
      }
      ctx.moveTo(pLeft.x, pLeft.y);
      ctx.lineTo(pRight.x, pRight.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 3. Rhumb Lines radiating from historical Compass Hubs
    ctx.strokeStyle = 'rgba(146, 64, 14, 0.09)';
    ctx.lineWidth = 0.75;
    COMPASS_HUBS.forEach(([hLat, hLng]) => {
      const hub = projectLatLng(hLat, hLng, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      // Radiate 16 navigation wind bearings
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(hub.x + Math.cos(angle) * 900, hub.y + Math.sin(angle) * 900);
        ctx.stroke();
      }

      // Small compass rose accent at hub
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180, 83, 9, 0.4)';
      ctx.fill();
    });

    // 4. Landmasses & Continents
    WORLD_CONTINENTS.forEach(feature => {
      if (feature.coordinates.length < 3) return;
      
      const pts = feature.coordinates.map(([cLat, cLng]) => 
        projectLatLng(cLat, cLng, MAP_BASE_WIDTH, MAP_BASE_HEIGHT)
      );

      // Coastal shallow water buffer
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(180, 155, 120, 0.6)';
      ctx.lineWidth = 10;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Land fill (Warm parchment land tint)
      ctx.fillStyle = '#F4EDE0';
      ctx.fill();

      // Sharp ink coastline
      ctx.strokeStyle = '#573D26';
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Land inner shadow / stippling effect
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.2)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });

    // 5. Navigable Inland Rivers
    FAMOUS_RIVERS.forEach(river => {
      if (river.coordinates.length < 2) return;
      const pts = river.coordinates.map(([rLat, rLng]) =>
        projectLatLng(rLat, rLng, MAP_BASE_WIDTH, MAP_BASE_HEIGHT)
      );

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = 'rgba(85, 115, 135, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    // 6. Charted Maritime Sea Lanes & The Northwest Passage
    SEA_CONNECTIONS.forEach(([n1, n2]) => {
      const node1 = SEA_NODES[n1];
      const node2 = SEA_NODES[n2];
      if (!node1 || !node2) return;

      const p1 = projectLatLng(node1.coords[0], node1.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      const p2 = projectLatLng(node2.coords[0], node2.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);

      const isNWPassage = node1.isNorthwestPassage || node2.isNorthwestPassage;

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      if (isNWPassage) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)'; // Icy cyan for Northwest Passage
        ctx.lineWidth = 2.2;
        ctx.setLineDash([4, 4]);
      } else {
        ctx.strokeStyle = 'rgba(180, 83, 9, 0.20)'; // Subtle antique sea lane
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 5]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Northwest Passage Text Label on map
    const nwLabelPt = projectLatLng(73.5, -92.0, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
    ctx.font = 'italic bold 12px "Cinzel", "Fraunces", serif';
    ctx.fillStyle = 'rgba(14, 116, 144, 0.85)';
    ctx.textAlign = 'center';
    ctx.fillText('THE HOPED-FOR NORTHWEST PASSAGE (ICE-BOUND)', nwLabelPt.x, nwLabelPt.y);

    // Weather & Currents Overlay (when toggled on)
    if (showWeather) {
      CLIMATE_ZONES.forEach(zone => {
        const nw = projectLatLng(zone.latMax, zone.lngMin, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
        const se = projectLatLng(zone.latMin, zone.lngMax, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);

        if (zone.id === 'doldrums') {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.08)'; // Golden calm
          ctx.fillRect(0, nw.y, MAP_BASE_WIDTH, se.y - nw.y);
          ctx.font = 'italic 11px "Cinzel", serif';
          ctx.fillStyle = 'rgba(180, 83, 9, 0.45)';
          ctx.textAlign = 'center';
          ctx.fillText('~ EQUATORIAL DOLDRUMS (DEAD CALM) ~', MAP_BASE_WIDTH / 2, (nw.y + se.y) / 2);
        } else if (zone.id === 'north_atlantic_gales') {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.06)';
          ctx.fillRect(nw.x, nw.y, se.x - nw.x, se.y - nw.y);
        }
      });
    }

    // 7. Draw Fog of War (Unexplored shroud)
    // Gather all explored points: European home waters + any discovered regions + active ships
    const discoveredCenters: { x: number; y: number; radius: number }[] = [];
    
    // Europe base visibility
    const euroCenter = projectLatLng(46, -2, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
    discoveredCenters.push({ x: euroCenter.x, y: euroCenter.y, radius: 260 });

    // Discovered regions
    regions.forEach(r => {
      if (r.discovered) {
        const pt = projectLatLng(r.coords[0], r.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
        discoveredCenters.push({ x: pt.x, y: pt.y, radius: 180 });
      }
    });

    // Active ships sight radius
    ships.forEach(s => {
      if (s.status !== 'LOST') {
        const pt = projectLatLng(s.coords[0], s.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
        discoveredCenters.push({ x: pt.x, y: pt.y, radius: 160 });
      }
    });

    // Fog overlay rendering using destination-out clipping
    const fogCanvas = document.createElement('canvas');
    fogCanvas.width = MAP_BASE_WIDTH;
    fogCanvas.height = MAP_BASE_HEIGHT;
    const fogCtx = fogCanvas.getContext('2d');
    if (fogCtx) {
      // Fill entire fog with semi-opaque mysterious aged parchment
      fogCtx.fillStyle = 'rgba(215, 202, 178, 0.86)';
      fogCtx.fillRect(0, 0, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);

      // Add "TERRA INCOGNITA" decorative script in deep ocean waters
      fogCtx.font = 'italic bold 28px "Cinzel", "Fraunces", serif';
      fogCtx.fillStyle = 'rgba(100, 70, 45, 0.28)';
      fogCtx.textAlign = 'center';
      fogCtx.fillText('TERRA INCOGNITA', 650, 450);
      fogCtx.fillText('OCEANUS OCCIDENTALIS', 950, 680);
      fogCtx.fillText('MARE PACIFICUM', 250, 800);
      fogCtx.fillText('TERRA AUSTRALIS INCOGNITA', 1650, 1020);

      // Punch out discovered sight circles
      fogCtx.globalCompositeOperation = 'destination-out';
      discoveredCenters.forEach(c => {
        const radial = fogCtx.createRadialGradient(c.x, c.y, c.radius * 0.4, c.x, c.y, c.radius);
        radial.addColorStop(0, 'rgba(0, 0, 0, 1)');
        radial.addColorStop(0.7, 'rgba(0, 0, 0, 0.85)');
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
        fogCtx.fillStyle = radial;
        fogCtx.beginPath();
        fogCtx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        fogCtx.fill();
      });

      // Composite fog onto main canvas
      ctx.drawImage(fogCanvas, 0, 0);
    }

    // 8. Draw Multi-Leg Maritime Course Lines for Sailing Ships
    ships.forEach(ship => {
      if (ship.status === 'SAILING') {
        const waypoints = (ship.waypoints && ship.waypoints.length > 0)
          ? ship.waypoints
          : (ship.destinationCoords ? [ship.coords, ship.destinationCoords] : []);

        if (waypoints.length >= 2) {
          ctx.beginPath();
          const startPt = projectLatLng(ship.coords[0], ship.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
          ctx.moveTo(startPt.x, startPt.y);

          const startIdx = Math.max(0, ship.currentWaypointIndex || 0);
          for (let i = startIdx; i < waypoints.length; i++) {
            const pt = projectLatLng(waypoints[i][0], waypoints[i][1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
            ctx.lineTo(pt.x, pt.y);
          }

          ctx.strokeStyle = ship.id === selectedShipId ? '#B45309' : 'rgba(120, 53, 15, 0.45)';
          ctx.lineWidth = ship.id === selectedShipId ? 2.5 : 1.5;
          ctx.setLineDash([6, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    });

    // 8. Mystery Investigation Marker (CROATOAN / Lost Ship Alert)
    if (activeMysteryCoords) {
      const mystPt = projectLatLng(activeMysteryCoords[0], activeMysteryCoords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      
      // Pulsing outer search ring
      const time = Date.now() / 400;
      const pulseRadius = 18 + Math.sin(time) * 5;
      ctx.beginPath();
      ctx.arc(mystPt.x, mystPt.y, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center compass marker
      ctx.beginPath();
      ctx.arc(mystPt.x, mystPt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#DC2626';
      ctx.fill();

      ctx.font = 'bold 12px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#B91C1C';
      ctx.textAlign = 'center';
      ctx.fillText('LOST EXPEDITION: SEARCH HERE', mystPt.x, mystPt.y - 24);
    }

    ctx.restore();
  }, [pan, zoom, ships, regions, selectedShipId, activeMysteryCoords]);

  // Redraw on canvas resize or state changes
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawMap();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawMap]);

  useEffect(() => {
    let animId: number;
    const render = () => {
      drawMap();
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [drawMap]);

  // Pan / Drag handlers
  const dragMoved = useRef(false);   // a drag that moved the map isn't a tap (it used to send the ship into the ocean)
  const handleMouseDown = (e: React.MouseEvent) => {
    dragMoved.current = false;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      if (Math.hypot(e.clientX - dragStart.x - pan.x, e.clientY - dragStart.y - pan.y) > 6) dragMoved.current = true;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    // Calculate real world coordinates under cursor
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert from screen to canvas coordinate space
    const canvasX = (mouseX - pan.x) / zoom;
    const canvasY = (mouseY - pan.y) / zoom;

    const coords = unprojectXY(canvasX, canvasY, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
    setCursorCoords(coords);

    // Check hover near any region POI
    const hitRegion = regions.find(r => {
      const pt = projectLatLng(r.coords[0], r.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      const dist = Math.hypot(pt.x - canvasX, pt.y - canvasY);
      return dist < 22;
    });
    setHoveredRegion(hitRegion || null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom(prev => Math.max(0.6, Math.min(3.5, prev * zoomFactor)));
  };

  // Canvas click interaction: Select POI or issue navigation order
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || dragMoved.current) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - pan.x) / zoom;
    const canvasY = (e.clientY - rect.top - pan.y) / zoom;

    // Check click on Mystery Investigation marker
    if (activeMysteryCoords && onInvestigateMystery) {
      const mystPt = projectLatLng(activeMysteryCoords[0], activeMysteryCoords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      if (Math.hypot(mystPt.x - canvasX, mystPt.y - canvasY) < 28) {
        SoundEngine.playCompassClick();
        onInvestigateMystery(activeMysteryCoords);
        return;
      }
    }

    // Check click on ship tokens
    for (const ship of ships) {
      const sPt = projectLatLng(ship.coords[0], ship.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      if (Math.hypot(sPt.x - canvasX, sPt.y - canvasY) < 24) {
        SoundEngine.playShipBell();
        onSelectShip(ship.id);
        const here = ship.status === 'ANCHORED' && regions.find(r => Math.hypot(r.coords[0] - ship.coords[0], r.coords[1] - ship.coords[1]) < 1.5);
        if (here) onSelectRegion(here);
        return;
      }
    }

    // Check click on Region POIs
    for (const region of regions) {
      const rPt = projectLatLng(region.coords[0], region.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      if (Math.hypot(rPt.x - canvasX, rPt.y - canvasY) < 24) {
        SoundEngine.playCompassClick();
        onSelectRegion(region);   // the region card has the "Sail here" button (a tap on a region used to send the ship straight away, so the card never opened)
        return;
      }
    }

    // If a ship is selected and user clicks empty ocean/land, sail to coordinates!
    if (selectedShip && selectedShip.status !== 'LOST' && cursorCoords) {
      const dist = calculateDistanceNauticalMiles(
        selectedShip.coords[0], selectedShip.coords[1],
        cursorCoords.lat, cursorCoords.lng
      );
      if (dist > 50) {
        SoundEngine.playShipBell();
        onOrderShipToTarget(
          selectedShip.id, 
          [cursorCoords.lat, cursorCoords.lng], 
          `Uncharted Sea (${cursorCoords.lat.toFixed(1)}°, ${cursorCoords.lng.toFixed(1)}°)`
        );
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing parchment-vignette bg-[#1C1814]"
      onPointerDown={handleMouseDown}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
      onPointerLeave={handleMouseUp}
      style={{ touchAction: 'none' }}
      onWheel={handleWheel}
      onClick={handleCanvasClick}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Floating Interactive DOM Overlays for Ships and POIs */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Region POI Markers */}
        {regions.map(region => {
          const pt = projectLatLng(region.coords[0], region.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
          const isHovered = hoveredRegion?.id === region.id;

          return (
            <div
              key={region.id}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
              style={{ left: pt.x, top: pt.y }}
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playCompassClick();
                onSelectRegion(region);
              }}
            >
              <div className={`group relative flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200 cursor-pointer ${
                region.hasTreatyPost 
                  ? 'bg-amber-600/90 border-amber-300 text-amber-100 shadow-md ring-2 ring-amber-400/40' 
                  : region.discovered 
                    ? 'bg-[#3A2A1D]/90 border-[#A37B4D] text-[#E7D6C0] hover:scale-125' 
                    : 'bg-[#2B231C]/60 border-[#5C4533] text-[#7A634E]'
              }`}>
                {region.hasTreatyPost ? (
                  <Anchor className="w-3.5 h-3.5" />
                ) : (
                  <Compass className="w-3.5 h-3.5" />
                )}

                {/* Region Label Tag */}
                <div className={`absolute top-full mt-1 px-2 py-0.5 whitespace-nowrap text-[11px] font-serif tracking-wide rounded bg-[#1C1814]/90 border border-[#8C6B46]/40 text-[#E7D6C0] shadow-sm pointer-events-none ${
                  isHovered || region.hasTreatyPost ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                }`}>
                  {region.name}
                  {region.hasTreatyPost && <span className="ml-1 text-amber-400">· Treaty Post</span>}
                </div>
              </div>
            </div>
          );
        })}

        {/* Ship Tokens */}
        {ships.map(ship => {
          const pt = projectLatLng(ship.coords[0], ship.coords[1], MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
          const isSelected = ship.id === selectedShipId;
          const isOverdue = ship.status === 'OVERDUE';
          const isLost = ship.status === 'LOST';

          if (isLost) return null; // Lost ships do not render on the map until found via search

          return (
            <div
              key={ship.id}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              style={{ left: pt.x, top: pt.y }}
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playShipBell();
                onSelectShip(ship.id);
                // an anchored ship sits on top of the place's marker, so tapping it opens that place too
                const here = ship.status === 'ANCHORED' && regions.find(r => Math.hypot(r.coords[0] - ship.coords[0], r.coords[1] - ship.coords[1]) < 1.5);
                if (here) onSelectRegion(here);
              }}
            >
              <div className={`relative flex flex-col items-center group ${isSelected ? 'scale-125' : 'hover:scale-110'} transition-transform`}>
                {/* Ship Flag & Icon */}
                {/* Ship Flag & Icon */}
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border shadow-lg ${
                  isOverdue 
                    ? 'bg-red-900 border-red-400 text-red-200 animate-pulse'
                    : isSelected 
                      ? 'bg-amber-700 border-amber-300 text-amber-100 ring-2 ring-amber-400' 
                      : 'bg-[#2A2118] border-[#8C6843] text-[#DFCEB7]'
                }`}>
                  <Ship className="w-4 h-4" />
                  {ship.celestialBonusActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-900 border border-cyan-400 text-cyan-200 flex items-center justify-center text-[9px] shadow" title="Celestial Fix Active (+15% Speed)">
                      ✦
                    </div>
                  )}
                </div>

                {/* Ship Name & Status Pill */}
                <div className="mt-1 px-1.5 py-0.5 text-[10px] whitespace-nowrap font-sans font-medium rounded bg-[#181411]/90 border border-[#785435]/50 text-[#EFE7D8] shadow flex items-center gap-1">
                  <span>{ship.name}</span>
                  {ship.celestialBonusActive && <span className="text-cyan-300 font-bold">+15%</span>}
                  {isOverdue && <span className="ml-1 text-red-400 font-bold">· OVERDUE!</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Control Bar (Bottom Left) */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#1C1814]/90 border border-[#785435]/60 rounded-lg p-1.5 shadow-xl text-[#E5D7C3] backdrop-blur-sm z-30">
        <button
          onClick={() => setZoom(z => Math.min(3.5, z + 0.25))}
          className="p-1.5 hover:bg-[#382E25] rounded transition-colors text-[#DFCEB7]"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.6, z - 0.25))}
          className="p-1.5 hover:bg-[#382E25] rounded transition-colors text-[#DFCEB7]"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            centerView();
          }}
          className="p-1.5 hover:bg-[#382E25] rounded transition-colors text-[#DFCEB7]"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            SoundEngine.playCompassClick();
            setShowWeather(v => !v);
          }}
          className={`p-1.5 rounded transition-colors flex items-center gap-1.5 text-xs font-serif ${
            showWeather ? 'bg-amber-800 text-amber-100 font-bold' : 'text-[#DFCEB7] hover:bg-[#382E25]'
          }`}
          title="Toggle Wind & Climate Zones"
        >
          <Wind className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Currents</span>
        </button>
        <div className="h-4 w-px bg-[#785435]/40 mx-1" />
        <div className="text-xs font-tabular text-[#BFA890] px-2 whitespace-nowrap">
          {cursorCoords ? (
            <>
              {Math.abs(cursorCoords.lat).toFixed(1)}°{cursorCoords.lat >= 0 ? 'N' : 'S'} ·{' '}
              {Math.abs(cursorCoords.lng).toFixed(1)}°{cursorCoords.lng >= 0 ? 'E' : 'W'}
            </>
          ) : (
            'Atlantic Ocean'
          )}
        </div>
      </div>

      {/* Selected Ship Instruction Banner */}
      {selectedShip && (
        <div className="absolute top-2 sm:top-4 left-2 right-2 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 bg-[#1C1814]/95 border border-amber-600/70 text-amber-200 px-3 sm:px-4 py-2 rounded-lg shadow-2xl flex flex-wrap items-center gap-x-3 gap-y-1 text-xs z-30">
          <Ship className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-amber-100">{selectedShip.name}</strong> selected: tap a place, then “Sail here”, or tap open ocean to sail there.
          </span>
          {selectedShip.currentWeatherName && (
            <span className="text-amber-300 font-tabular font-medium">
              · Weather: {selectedShip.currentWeatherName}
            </span>
          )}
          {selectedShip.celestialBonusActive ? (
            <span className="text-cyan-300 font-semibold flex items-center gap-1 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700">
              ✦ Celestial Fix Active (+15% Knots)
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playCompassClick();
                onOpenCelestialModal?.(selectedShip.id);
              }}
              className="px-2.5 py-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-serif font-bold text-[11px] rounded shadow flex items-center gap-1 transition-all cursor-pointer"
              title="Align astrolabe with the North Star or Southern Cross for +15% speed"
            >
              <span>✦ Take Celestial Sight (+15% Speed)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
