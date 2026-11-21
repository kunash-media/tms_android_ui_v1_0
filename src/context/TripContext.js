import { createContext, useContext, useState } from 'react';
import { LIVE_TRIP, UPCOMING_TRIPS, HISTORY_TRIPS } from '../data/dummy';

const TripContext = createContext(null);
export const useTrips = () => useContext(TripContext);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${pad(d.getDate())} ${MONTHS[d.getMonth()]}`;
const fmtTime = (d) => {
  let h = d.getHours();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h)}:${pad(d.getMinutes())} ${ap}`;
};

const toHistory = (trip, status) => {
  let duration = '—';
  if (status === 'Completed' && trip.startedMs) {
    const mins = Math.round((Date.now() - trip.startedMs) / 60000);
    duration = `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }
  return {
    id: trip.id,
    status,
    from: trip.source,
    to: trip.destination,
    date: trip.startedAt,
    distanceKm: trip.distanceKm,
    duration,
    stops: trip.stops,
  };
};

export const TripProvider = ({ children }) => {
  const [active, setActive] = useState(LIVE_TRIP);
  const [upcoming] = useState(UPCOMING_TRIPS);
  const [history, setHistory] = useState(HISTORY_TRIPS);

  // legs[i] = distance from points[i] to points[i + 1], already verified by the driver
  const startTrip = ({ points, legs }) => {
    const now = new Date();
    const stops = points.map((p, i) => ({
      name: p.name,
      area: p.address || '',
      km: i === 0 ? 0 : legs[i - 1].km,
      kmSource: i === 0 ? null : legs[i - 1].src, // 'auto' | 'manual', for admin audit
      date: fmtDate(now),
      time: '',
      done: false,
      proofUri: null,
      lat: p.lat,
      lng: p.lng,
    }));
    const total = Math.round(stops.reduce((a, s) => a + s.km, 0) * 10) / 10;
    setActive({
      id: `TR-${Date.now() % 100000}`,
      status: 'In transit',
      source: stops[0].name,
      destination: stops[stops.length - 1].name,
      startedAt: `${fmtDate(now)} · ${fmtTime(now)}`,
      startedMs: now.getTime(),
      progress: 0,
      distanceKm: total,
      stops,
    });
  };

  const markStopDone = (tripId, index, uri) => {
    if (!active || active.id !== tripId) return;
    const now = new Date();
    const stops = active.stops.map((s, i) =>
      i === index ? { ...s, done: true, proofUri: uri, date: fmtDate(now), time: fmtTime(now) } : s
    );
    const doneCount = stops.filter((s) => s.done).length;
    const next = { ...active, stops, progress: doneCount / stops.length };
    if (doneCount === stops.length) {
      setHistory((h) => [toHistory(next, 'Completed'), ...h]);
      setActive(null);
    } else {
      setActive(next);
    }
  };

  const cancelTrip = () => {
    if (!active) return;
    setHistory((h) => [toHistory(active, 'Cancelled'), ...h]);
    setActive(null);
  };

  // always return the freshest copy of a trip (live state changes after uploads)
  const resolveTrip = (t) => {
    if (!t) return null;
    if (active?.id === t.id) return active;
    return history.find((x) => x.id === t.id) || upcoming.find((x) => x.id === t.id) || t;
  };

  return (
    <TripContext.Provider
      value={{ active, upcoming, history, startTrip, markStopDone, cancelTrip, resolveTrip }}
    >
      {children}
    </TripContext.Provider>
  );
};