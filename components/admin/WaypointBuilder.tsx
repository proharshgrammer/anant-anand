'use client';

import { ChevronUp, ChevronDown, Trash2, Plus, MapPin } from 'lucide-react';
import type { Waypoint } from '@/types';

interface WaypointBuilderProps {
  value: Waypoint[];
  onChange: (waypoints: Waypoint[]) => void;
}

const emptyWaypoint = (day: number): Waypoint => ({
  day,
  name: '',
  lat: 0,
  lng: 0,
  description: '',
});

export default function WaypointBuilder({ value, onChange }: WaypointBuilderProps) {
  const waypoints = value ?? [];

  const update = (index: number, patch: Partial<Waypoint>) => {
    const next = waypoints.map((w, i) =>
      i === index ? { ...w, ...patch } : w
    );
    onChange(next);
  };

  const add = () => {
    const nextDay = waypoints.length > 0
      ? Math.max(...waypoints.map((w) => w.day)) + 1
      : 1;
    onChange([...waypoints, emptyWaypoint(nextDay)]);
  };

  const remove = (index: number) => {
    const next = waypoints
      .filter((_, i) => i !== index)
      .map((w, i) => ({ ...w, day: i + 1 }));
    onChange(next);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...waypoints];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next.map((w, i) => ({ ...w, day: i + 1 })));
  };

  const moveDown = (index: number) => {
    if (index === waypoints.length - 1) return;
    const next = [...waypoints];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next.map((w, i) => ({ ...w, day: i + 1 })));
  };

  return (
    <div className="space-y-3">
      {waypoints.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No waypoints yet. Add day-by-day stops for the itinerary map.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {waypoints.map((wp, index) => (
            <div
              key={index}
              className="border border-teal-100 rounded-xl p-4 bg-white relative"
              style={{ borderLeft: '3px solid #0d9488' }}
            >
              {/* Day badge + actions */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <MapPin className="w-3 h-3" />
                  Day {wp.day}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-teal-50 transition-colors"
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === waypoints.length - 1}
                    className="p-1 text-gray-400 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-teal-50 transition-colors"
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors ml-1"
                    aria-label="Remove waypoint"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Location Name */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    value={wp.name}
                    onChange={(e) => update(index, { name: e.target.value })}
                    placeholder="e.g. Haridwar — Ganga Aarti"
                    className="input-field text-sm"
                  />
                </div>

                {/* Lat / Lng */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={wp.lat || ''}
                      onChange={(e) => update(index, { lat: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 29.9457"
                      className="input-field text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={wp.lng || ''}
                      onChange={(e) => update(index, { lng: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 78.1642"
                      className="input-field text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Coordinate helper */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>🗺️ Need coordinates?</span>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-800 underline"
                  >
                    Open Google Maps →
                  </a>
                  <span className="text-gray-400">then right-click → copy lat, lng</span>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Day Description
                  </label>
                  <textarea
                    value={wp.description}
                    onChange={(e) => update(index, { description: e.target.value })}
                    rows={2}
                    placeholder="Activities, meals, accommodation for this day…"
                    className="input-field text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-teal-300 text-teal-700 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Waypoint (Day {waypoints.length + 1})
      </button>
    </div>
  );
}
