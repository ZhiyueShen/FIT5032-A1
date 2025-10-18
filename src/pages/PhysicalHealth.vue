<template>
  <section class="container py-4">
    <h2 class="mb-3">Physical Health</h2>
    <div class="alert alert-info">
      Need help? Enter your address below and we'll find the nearest hospital and provide directions.
    </div>

    <div class="row g-2 align-items-center mb-3" style="max-width: 680px">
      <div class="col">
        <input v-model="address" class="form-control" placeholder="For example：305 Grattan St, Carlton VIC" />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="findHospitals" :disabled="loading">
          {{ loading ? 'Searching…' : 'Find nearby hospitals' }}
        </button>
      </div>
      <div class="col-auto">
        <button class="btn btn-outline-secondary" @click="locateMe" :disabled="loading">Use Current Location</button>
      </div>
    </div>

    <div id="map" style="height: 520px; width: 100%; border-radius: 10px"></div>

    <div v-if="results.length" class="mt-3" style="max-width: 680px">
      <h5 class="mb-2">Nearby hospitals (sorted by distance)</h5>
      <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(r, i) in results" :key="r.id">
          <div>
            <div>
                <strong>{{ r.tags?.name || "Unnamed Hospital" }}</strong>
                <div class="text-muted small">Distance: {{ (r._dist / 1000).toFixed(2) }} km</div>
                </div>
            </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-success" @click="navigateTo([r.lon, r.lat])">NavigateTo</button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const address = ref("");
const loading = ref(false);
let map: mapboxgl.Map;
let originMarker: mapboxgl.Marker | null = null;
let poiMarkers: mapboxgl.Marker[] = [];
let routeLayerId = "route-line";
let routeSourceId = "route-source";
const results = ref<any[]>([]);

function haversine(a: [number, number], b: [number, number]) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]), lat2 = toRad(b[1]);
  const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}


onMounted(() => {  // Map 
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [144.9631, -37.8136], // Melbourne
    zoom: 12,
  });
  map.addControl(new mapboxgl.NavigationControl(), "top-right");
});


function flyTo(center: [number, number]) {
  map.flyTo({ center, zoom: 14 });
}

function locateMe() {
  if (!navigator.geolocation) {
    alert("Your browser does not support location");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lngLat: [number, number] = [pos.coords.longitude, pos.coords.latitude];
      setOrigin(lngLat, "My Location");
    },
    () => alert("Unable to obtain current location")
  );
}

function setOrigin(center: [number, number], label = "Starting point") {
  flyTo(center);
  if (originMarker) originMarker.remove();
  originMarker = new mapboxgl.Marker({ color: "#e11d48" })
    .setLngLat(center)
    .setPopup(new mapboxgl.Popup().setText(label))
    .addTo(map);
}

async function geocodeAddress(q: string): Promise<[number, number] | null> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?limit=1&access_token=${mapboxgl.accessToken}`;
  const res = await fetch(url);
  const data = await res.json();
  return data?.features?.[0]?.center ?? null;
}

async function searchHospitalsAround(center: [number, number]) {
  const radius = 5000; 
  const overpassUrl =
    `https://overpass-api.de/api/interpreter?data=[out:json];` +
    `node["amenity"="hospital"](around:${radius},${center[1]},${center[0]});out;`;

  const res = await fetch(overpassUrl);
  const data = await res.json();
  const elements = (data?.elements ?? []) as any[];

  if (!elements.length) {
    alert("No hospitals found nearby.");
    return;
  }

  // coutn the distance and sort by distance
  elements.forEach((e) => (e._dist = haversine(center, [e.lon, e.lat])));
  elements.sort((a, b) => a._dist - b._dist);

  poiMarkers.forEach((m) => m.remove());
  poiMarkers = [];

  elements.forEach((e) => {
    const m = new mapboxgl.Marker()
      .setLngLat([e.lon, e.lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<strong>${e.tags.name || "Unnamed Hospital"}</strong><br/>Distance: ${(e._dist / 1000).toFixed(2)} km`
        )
      )
      .addTo(map);
    poiMarkers.push(m);
  });

  results.value = elements;

  // auto navigator
  const nearest = elements[0];
  if (nearest) {
    flyTo([nearest.lon, nearest.lat]);
    await navigateTo([nearest.lon, nearest.lat]);
    alert(`Navigating to: ${nearest.tags.name || "Nearest hospital"}`);
  }
}

//find hospital
async function findHospitals() {
  loading.value = true;
  let center: [number, number] | null = null;

  if (address.value.trim()) {
    center = await geocodeAddress(address.value.trim());
    if (!center) {
      console.log("Address not found");
      loading.value = false;
      return;
    }
    setOrigin(center, address.value);
  } else if (originMarker) {
    center = originMarker.getLngLat().toArray() as [number, number];
  } else {
    console.log("No address or current location");
    loading.value = false;
    return;
  }

  await searchHospitalsAround(center);
  loading.value = false;
}

async function navigateTo(target: [number, number]) {
  const origin = originMarker?.getLngLat().toArray() as [number, number] | undefined;
  if (!origin) {
    alert("Please set the starting point first (enter the address or location)");
    return;
  }

  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${origin[0]},${origin[1]};${target[0]},${target[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
  const res = await fetch(url);
  const data = await res.json();
  const geom = data.routes[0].geometry as GeoJSON.LineString;
  if (!geom) {
    alert("Route not found");
    return;
  }

  if (map.getLayer(routeLayerId)) map.removeLayer(routeLayerId);
  if (map.getSource(routeSourceId)) map.removeSource(routeSourceId);

map.addSource(routeSourceId, {
  type: "geojson",
  data: {
    type: "Feature",
    properties: {}, 
    geometry: geom, 
  } as GeoJSON.Feature<GeoJSON.LineString>,
});

map.addLayer({
  id: routeLayerId,
  type: "line",
  source: routeSourceId,
  paint: { "line-color": "#1db7dd", "line-width": 5 },
  layout: { "line-join": "round", "line-cap": "round" },
});
  const bounds = new mapboxgl.LngLatBounds();
  (geom.coordinates as number[][]).forEach(c => bounds.extend(c as [number, number]));
  map.fitBounds(bounds, { padding: 50 });
}
</script>
