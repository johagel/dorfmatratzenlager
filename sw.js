/* Zwischenspeicher: Scans und Bibliotheken bleiben auf dem Handy (schneller Start),
   die App selbst kommt immer frisch vom Server, Routen-Daten werden nie zwischengespeichert. */
const CACHE = 'dml-v3';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  const fixed = url.pathname.includes('/models/') || url.pathname.includes('/icons/') || url.hostname === 'cdn.jsdelivr.net';
  const page = url.origin === location.origin && !fixed && !url.pathname.includes('/rest/');
  if (fixed){
    /* Dateien mit Versionsnummer ändern sich nie: zuerst aus dem Speicher */
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
  } else if (page){
    /* App-Seite: zuerst Netz, ohne Netz die letzte Fassung */
    e.respondWith(fetch(req).then(res => {
      if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req)));
  }
});
