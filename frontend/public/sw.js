/* Service worker minimal : sans réseau (parking souterrain, zone blanche), une page demandée
   est remplacée par la page ultra-légère avec le numéro. Il ne met rien d'autre en cache et
   ne touche ni à l'API ni aux fichiers du site. */
const CACHE = "urgence-v1";
self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.add("/urgence.html")).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
    e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
    if (e.request.mode !== "navigate") return;
    e.respondWith(fetch(e.request).catch(() => caches.match("/urgence.html")));
});
