// Set USE_MOCK = false once your backend endpoint exists.
const USE_MOCK = true;
const BASE_URL = 'http://YOUR_LAN_IP:8080'; // placeholder, use your PC's LAN IP for a real phone

export async function uploadProof(tripId, stopIndex, uri) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return { ok: true };
  }
  const form = new FormData();
  form.append('tripId', tripId);
  form.append('stopIndex', String(stopIndex));
  form.append('image', { uri, name: `proof-${tripId}-${stopIndex}.jpg`, type: 'image/jpeg' });
  const res = await fetch(`${BASE_URL}/api/trips/${tripId}/stops/${stopIndex}/proof`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed ${res.status}`);
  return res.json();
}