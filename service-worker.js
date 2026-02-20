const CACHE_NAME = 'rapitienda-v4'; // Nueva versión para forzar actualización
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './logo.jpg'
];

// Instalar y forzar que la nueva versión tome el control inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

// Activar y borrar cachés antiguas (v1, v2, v3...)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia: Primero Internet (para tener el código más reciente), si falla (offline), usa la Caché
self.addEventListener('fetch', event => {
  // Ignorar las peticiones a Firebase y APIs externas
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis') || event.request.url.includes('jspdf')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});