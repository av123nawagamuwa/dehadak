// Dehadak PWA Web Push Notification Service Worker Extension
// Preserves existing Vite PWA caching, offline mode, and update behaviors

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Dehadak — New profile',
        body: event.data.text() || 'A new profile is available. Open Dehadak to discover more.',
      };
    }
  }

  const title = data.title || 'Dehadak — New profile';
  const options = {
    body: data.body || 'A new profile is available. Open Dehadak to discover more.',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-72x72.png',
    tag: data.tag || 'dehadak-new-profile',
    renotify: true,
    data: data.data || { url: '/search' },
    actions: [
      {
        action: 'open',
        title: 'Open Dehadak',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/search';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. If an existing window is open on this origin, focus it and navigate
      for (const client of windowClients) {
        if (client.url && 'focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          }
          return client;
        }
      }

      // 2. If no window is open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
