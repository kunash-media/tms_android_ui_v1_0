const KEY = process.env.EXPO_PUBLIC_LOCATIONIQ_KEY;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const pair = (a, b) => `${a.lng},${a.lat};${b.lng},${b.lat}`;
const toLeg = (route) => ({
  km: Math.round(route.distance / 100) / 10, // metres -> km, 1 decimal
  mins: Math.round(route.duration / 60),
  src: 'auto',
});

async function viaLocationIQ(a, b) {
  const json = await getJson(
    `https://us1.locationiq.com/v1/directions/driving/${pair(a, b)}?key=${KEY}&overview=false`
  );
  const r = json?.routes?.[0];
  if (!r) throw new Error('no route');
  return toLeg(r);
}

async function viaOSRM(a, b) {
  const json = await getJson(
    `https://router.project-osrm.org/route/v1/driving/${pair(a, b)}?overview=false`
  );
  const r = json?.routes?.[0];
  if (!r) throw new Error('no route');
  return toLeg(r);
}

async function oneLeg(a, b) {
  try {
    return await viaLocationIQ(a, b);
  } catch {
    try {
      return await viaOSRM(a, b);
    } catch {
      return null;
    }
  }
}

/**
 * Returns one entry per segment (points.length - 1):
 *   { km, mins, src: 'auto' | 'manual' }  -> distance is known
 *   null                                  -> could not be calculated, ask the driver
 * Never estimates.
 */
export async function calcLegs(points) {
  const legs = [];
  let called = false;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];

    // a manually added point carries its own km from the previous point
    if (cur.manual && typeof cur.km === 'number') {
      legs.push({ km: cur.km, mins: null, src: 'manual' });
      continue;
    }
    // a manual point has no coordinates, so the road distance can't be routed
    if (prev.lat == null || cur.lat == null) {
      legs.push(null);
      continue;
    }
    if (called) await sleep(600); // stay under the 2 requests/sec free limit
    called = true;
    legs.push(await oneLeg(prev, cur));
  }
  return legs;
}