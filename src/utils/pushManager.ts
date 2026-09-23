import { API_BASE_URL } from '@/config';

/**
 * Converts a base64 string to a Uint8Array for VAPID applicationServerKey
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Checks if the current browser environment supports Service Workers and Web Push.
 */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Gets the current notification permission status.
 */
export function getPushPermissionState(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Requests notification permission from user and registers push subscription with backend.
 * ONLY called upon explicit user button click!
 */
export async function subscribeUserToPush(token: string): Promise<{
  success: boolean;
  permission: NotificationPermission | 'unsupported';
  error?: string;
}> {
  if (!isPushSupported()) {
    return { success: false, permission: 'unsupported', error: 'Push notifications are not supported by this browser.' };
  }

  // 1. Request permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return {
      success: false,
      permission,
      error: permission === 'denied'
        ? 'Notification permission was denied. Please allow notifications in your browser settings.'
        : 'Notification permission was not granted.',
    };
  }

  try {
    // 2. Fetch VAPID public key from backend
    const vapidRes = await fetch(`${API_BASE_URL}/api/notifications/push/vapid-key`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!vapidRes.ok) {
      throw new Error('Failed to retrieve server VAPID key');
    }
    const { publicKey } = await vapidRes.json();

    // 3. Obtain Service Worker registration
    const registration = await navigator.serviceWorker.ready;

    // 4. Check for existing subscription or subscribe
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
      });
    }

    const subJson = subscription.toJSON();

    // 5. Send subscription to backend
    const saveRes = await fetch(`${API_BASE_URL}/api/notifications/push/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subJson.endpoint,
        keys: subJson.keys,
        userAgent: navigator.userAgent,
      }),
    });

    if (!saveRes.ok) {
      const errData = await saveRes.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to register subscription with server');
    }

    return { success: true, permission: 'granted' };
  } catch (error: any) {
    console.error('[PushManager] Subscription error:', error);
    return { success: false, permission: 'granted', error: error.message || 'Error subscribing to push' };
  }
}

/**
 * Unsubscribes current device from push notifications.
 */
export async function unsubscribeUserFromPush(token?: string): Promise<boolean> {
  if (!isPushSupported()) return true;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      if (token) {
        await fetch(`${API_BASE_URL}/api/notifications/push/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint }),
        }).catch(() => {});
      }
    }

    return true;
  } catch (err) {
    console.warn('[PushManager] Unsubscribe error:', err);
    return false;
  }
}

/**
 * Detaches push subscription on logout so another user on the same device does not receive alerts.
 */
export async function detachPushOnLogout(): Promise<void> {
  const token = localStorage.getItem('dehadak_auth');
  await unsubscribeUserFromPush(token || undefined);
}
