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
 * Checks if the device is running iOS (iPhone, iPad, iPod)
 */
export function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

/**
 * Checks if the web app is running as an installed standalone PWA
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    ('standalone' in window.navigator && Boolean((window.navigator as any).standalone)) ||
    window.matchMedia('(display-mode: standalone)').matches
  );
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
    // If on iOS browser and not installed as PWA:
    if (isIos() && !isStandalone()) {
      return {
        success: false,
        permission: 'unsupported',
        error: 'On iPhone and iPad, please first tap the Share button and select "Add to Home Screen". Open the installed app from your Home Screen to enable push notifications.',
      };
    }
    return { success: false, permission: 'unsupported', error: 'Push notifications are not supported by this browser.' };
  }

  // 1. Request permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return {
      success: false,
      permission,
      error: permission === 'denied'
        ? 'Notification permission was denied. Please allow notifications in your browser or system settings.'
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
    const platform = isIos() ? 'iOS' : /Android/.test(navigator.userAgent) ? 'Android' : 'Desktop';
    const deviceLabel = isStandalone() ? `${platform} PWA` : `${platform} Browser`;

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
        platform,
        deviceLabel,
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
 * Reconciles push subscription upon login if permission was already granted.
 */
export async function syncPushSubscriptionOnLogin(token: string): Promise<void> {
  if (!token || !isPushSupported()) return;
  if (Notification.permission !== 'granted') return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const subJson = subscription.toJSON();
      const platform = isIos() ? 'iOS' : /Android/.test(navigator.userAgent) ? 'Android' : 'Desktop';
      const deviceLabel = isStandalone() ? `${platform} PWA` : `${platform} Browser`;

      await fetch(`${API_BASE_URL}/api/notifications/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          userAgent: navigator.userAgent,
          platform,
          deviceLabel,
        }),
      }).catch(() => {});
    }
  } catch (e) {
    // Non-blocking sync attempt
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
