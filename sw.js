const CACHE_NAME = 'english-v2'; // 👈 C'est ce numéro qu'il faudra changer (v3, v4...) à chaque MAJ
const ASSETS = [
  './index.html',
  './script.js',
  './style.css',
  './verbs.json'
];

// 1. Installation : Mise en cache des nouveaux fichiers
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// 2. NOUVEAU - Activation : Nettoyage automatique des anciens caches obsolètes
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Nettoyage de l'ancien cache :", cache);
            return caches.delete(cache); // Supprime les anciennes versions (v1, v2...)
          }
        })
      );
    })
  );
});

// 3. Interception des requêtes : Service depuis le cache local
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});