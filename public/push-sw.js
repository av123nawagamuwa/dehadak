// Dehadak PWA Web Push Notification Service Worker Extension
// Preserves existing Vite PWA caching, offline mode, and update behaviors

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Dehadak.lk',
        body: event.data.text() || 'A new compatible profile has joined. Tap to view safely.',
      };
    }
  }

  const title = data.title || 'Dehadak.lk';
  const targetUrl = data.url || (data.data && data.data.url) || '/notifications';
  const notificationId = data.notificationId || (data.data && data.data.notificationId) || null;

  const options = {
    body: data.body || 'A new compatible profile has joined. Tap to view safely.',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-72x72.png',
    tag: data.tag || 'dehadak-new-profile',
    renotify: Boolean(data.renotify),
    data: {
      url: targetUrl,
      notificationId,
      type: data.type || (data.data && data.data.type) || 'NEW_COMPATIBLE_PROFILE',
    },
    actions: [
      {
        action: 'view',
        title: 'View Profile',
      },
    ],
  };

  // Only attach rich image preview if provided in payload and permitted
  if (data.image) {
    options.image = data.image;
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notifData = event.notification.data || {};
  const targetUrl = notifData.url || '/notifications';
  const notificationId = notifData.notificationId;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. If an existing window is open on this origin, focus it and navigate
      for (const client of windowClients) {
        if (client.url && 'focus' in client) {
          client.focus();
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          if (notificationId && 'postMessage' in client) {
            client.postMessage({
              type: 'DEHADAK_NOTIFICATION_CLICKED',
              notificationId,
              targetUrl,
            });
          }
          return client;
        }
      }

      // 2. If no window is open, open a new standalone PWA or browser window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
