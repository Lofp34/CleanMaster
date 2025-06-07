const CACHE_NAME = 'cleanmaster-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Installation du Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: Installation en cours...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Service Worker: Erreur lors de la mise en cache', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activation');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retourne le cache s'il existe, sinon fait une requête réseau
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(function(response) {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cloner la réponse
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(function() {
        // En cas d'échec, retourner une page hors ligne personnalisée
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Gestion des notifications push (pour les rappels futurs)
self.addEventListener('push', function(event) {
  console.log('Service Worker: Notification push reçue');
  
  const options = {
    body: event.data ? event.data.text() : 'Il est temps de faire un peu de ménage ! 🧹',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Commencer le ménage',
        icon: '/icons/action-start.png'
      },
      {
        action: 'close',
        title: 'Plus tard',
        icon: '/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CleanMaster - Rappel ménage', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', function(event) {
  console.log('Service Worker: Clic sur notification');
  
  event.notification.close();

  if (event.action === 'explore') {
    // Ouvrir l'application
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Fermer la notification
    console.log('Notification fermée par l\'utilisateur');
  }
});

// Synchronisation en arrière-plan (pour sauvegarder les données hors ligne)
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Synchronisation en arrière-plan');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return new Promise(function(resolve, reject) {
    // Ici on pourrait synchroniser les données locales avec un serveur
    // Pour l'instant, on simule juste une synchronisation
    console.log('Synchronisation des données CleanMaster...');
    resolve();
  });
} 