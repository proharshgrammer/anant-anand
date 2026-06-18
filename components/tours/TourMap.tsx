'use client';

import { useEffect, useRef } from 'react';
import type { Waypoint } from '@/types';

interface TourMapProps {
  waypoints: Waypoint[];
  className?: string;
}

/**
 * TourMap — Client-side Leaflet.js interactive map (IMAP-01, IMAP-02, IMAP-03)
 *
 * Features:
 * - OpenStreetMap tiles (IMAP-01)
 * - Numbered circular markers per day-waypoint (IMAP-02)
 * - Animated dashed polyline connecting markers in route order (D-04)
 * - Popup on marker click with day number, location, activity (IMAP-03)
 * - Two-finger scroll constraint on mobile (D-02)
 * - Tight 4px/8px spacing inside popups (UI-SPEC)
 *
 * Must be dynamically imported with ssr: false due to Leaflet's window dependency.
 */
export default function TourMap({ waypoints, className = '' }: TourMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (!waypoints || waypoints.length === 0) return;

    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default marker icon paths (Webpack/Next.js asset handling)
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Calculate center from waypoints
      const lats = waypoints.map((w) => w.lat);
      const lngs = waypoints.map((w) => w.lng);
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

      // Initialize map
      const map = L.default.map(mapRef.current!, {
        center: [centerLat, centerLng],
        zoom: 6,
        scrollWheelZoom: false,    // Disable single-finger/scroll-wheel zoom (D-02)
      });

      mapInstanceRef.current = map;

      // --- OpenStreetMap tile layer (IMAP-01) ---
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // --- Animated dashed polyline connecting waypoints (D-04) ---
      const latlngs = waypoints.map((w) => [w.lat, w.lng] as [number, number]);

      L.default.polyline(latlngs, {
        color: '#f97316',        // Accent color from UI-SPEC
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 8',       // Dashed line for route (D-04)
        lineJoin: 'round',
      }).addTo(map);

      // --- Numbered circular markers per day-waypoint (IMAP-02) ---
      waypoints.forEach((waypoint) => {
        const markerIcon = L.default.divIcon({
          className: '',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background-color: #f97316;
              border: 3px solid #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 13px;
              font-weight: 700;
              font-family: Poppins, sans-serif;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            ">${waypoint.day}</div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.default.marker([waypoint.lat, waypoint.lng], { icon: markerIcon });

        // Popup with tight 4px/8px spacing (IMAP-03, UI-SPEC)
        const popupContent = `
          <div style="font-family: Poppins, sans-serif; min-width: 160px; max-width: 220px;">
            <div style="
              background-color: #f97316;
              color: white;
              padding: 4px 8px;
              border-radius: 4px 4px 0 0;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">Day ${waypoint.day}</div>
            <div style="padding: 8px;">
              <p style="font-size: 13px; font-weight: 600; color: #111827; margin: 0 0 4px 0;">${waypoint.name}</p>
              <p style="font-size: 12px; color: #6b7280; margin: 0; line-height: 1.4;">${waypoint.description}</p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 240,
          className: 'tour-map-popup',
        });

        marker.addTo(map);
      });

      // Fit map bounds to show all waypoints
      if (waypoints.length > 1) {
        const bounds = L.default.latLngBounds(latlngs);
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      // --- Two-finger scroll on mobile (D-02) ---
      // Show overlay hint when user tries to scroll with one finger
      const container = map.getContainer();
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.35);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Poppins, sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 800;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
        border-radius: 8px;
        text-align: center;
        padding: 16px;
      `;
      overlay.innerHTML = '🤏 Use two fingers to scroll the map';
      container.style.position = 'relative';
      container.appendChild(overlay);

      let overlayTimeout: ReturnType<typeof setTimeout>;

      container.addEventListener('touchstart', (e: TouchEvent) => {
        if (e.touches.length === 1) {
          // One finger — show hint and prevent map interaction
          map.scrollWheelZoom.disable();
          map.dragging.disable();
          overlay.style.opacity = '1';
          clearTimeout(overlayTimeout);
          overlayTimeout = setTimeout(() => {
            overlay.style.opacity = '0';
            map.dragging.enable();
          }, 1500);
        } else {
          // Two fingers — allow map interaction
          map.dragging.enable();
          map.scrollWheelZoom.enable();
          overlay.style.opacity = '0';
          clearTimeout(overlayTimeout);
        }
      });

      container.addEventListener('touchend', () => {
        map.dragging.enable();
        overlay.style.opacity = '0';
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [waypoints]);

  if (!waypoints || waypoints.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`} style={{ height: '400px' }}>
        <p className="text-gray-500 text-sm">No route map available for this tour.</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      id="tour-leaflet-map"
      className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm ${className}`}
      style={{ height: '400px', width: '100%' }}
      aria-label="Interactive tour route map"
    />
  );
}
