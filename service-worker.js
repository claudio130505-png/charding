
const CACHE_NAME = "charding-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./imagen/icono-192.png",
    "./imagen/icono-512.png"
];

// Guardar los archivos principales
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ARCHIVOS);
        })
    );
    self.skipWaiting();
});

// Activar y limpiar versiones anteriores
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Usar internet primero y recurrir a la copia guardada
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response.ok && new URL(event.request.url).origin === self.location.origin) {
                    const copia = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, copia);
                    });
                }
                return response;
            })
            .catch(() => caches.match(event.request).then(response => {
                return response || (event.request.mode === "navigate"
                    ? caches.match("./index.html")
                    : undefined);
            }))
    );
});
