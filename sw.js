const CACHE_NAME = 'scoutcare-ph-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './js/storage.js',
  './js/i18n.js',
  './js/state.js',
  './js/data/visayasDirectory.js',
  './js/app.js',
  './js/tests.js',
  './js/viewmodels/DashboardVM.js',
  './js/viewmodels/ExpeditionMapVM.js',
  './js/viewmodels/KitVM.js',
  './js/viewmodels/FirstAidVM.js',
  './js/viewmodels/MedicineVM.js',
  './js/viewmodels/EmergencyVM.js',
  './js/viewmodels/CampingVM.js',
  './js/viewmodels/TodoVM.js',
  './js/viewmodels/EssentialsVM.js',
  './js/viewmodels/LearningVM.js',
  './js/viewmodels/IncidentsVM.js',
  './js/viewmodels/ProfileVM.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Cache prefill warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null)
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
