const CACHE_NAME = 'm1ct-coffee-v1';
const urlsToCache = [
  '/',
  '/favicon.svg',
  '/manifest.json'
];

// 현재 URL 저장을 위한 키
const CURRENT_URL_KEY = 'current-url';

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache failed:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // 현재 URL 저장 (GET 요청인 경우만)
  if (event.request.method === 'GET' && event.request.url.includes(self.location.origin)) {
    self.clients.matchAll().then(clients => {
      if (clients.length > 0) {
        // IndexedDB에 현재 URL 저장
        const url = new URL(event.request.url);
        if (url.pathname !== '/sw.js' && !url.pathname.includes('.')) {
          localStorage.setItem(CURRENT_URL_KEY, event.request.url);
        }
      }
    });
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// PWA 시작 시 저장된 URL로 리다이렉트
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_SAVED_URL') {
    const savedUrl = localStorage.getItem(CURRENT_URL_KEY);
    event.ports[0].postMessage({ savedUrl });
  }
  
  if (event.data && event.data.type === 'SAVE_CURRENT_URL') {
    localStorage.setItem(CURRENT_URL_KEY, event.data.url);
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync triggered')
    );
  }
});

// Push notification support
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: data.data
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
}); 