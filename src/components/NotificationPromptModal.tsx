import { useState, useEffect } from 'react';
import { Bell, Sparkles, Smartphone, Share2, Check, X, Loader2 } from 'lucide-react';
import {
  getPushPermissionState,
  subscribeUserToPush,
  isIos,
  isStandalone,
} from '@/utils/pushManager';

const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function NotificationPromptModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');

  useEffect(() => {
    // 1. Check if user is logged in
    const token = localStorage.getItem('dehadak_auth');
    if (!token) return;

    // 2. Check if dismissed recently
    const dismissedAt = localStorage.getItem('dehadak_notif_prompt_dismissed');
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_COOLDOWN_MS) return;
    }

    // 3. Check permission status
    const permission = getPushPermissionState();
    if (permission === 'granted' || permission === 'denied') {
      return;
    }

    // Delay prompt appearance by 3.5 seconds to avoid interrupting immediate page landing
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('dehadak_notif_prompt_dismissed', Date.now().toString());
    setIsOpen(false);
  };

  const handleEnableNotifications = async () => {
    const token = localStorage.getItem('dehadak_auth');
    if (!token) return;

    setLoading(true);
    setStatusMessage('');

    try {
      const result = await subscribeUserToPush(token);

      if (result.success) {
        setStatusType('success');
        setStatusMessage('Notifications enabled successfully! You will receive new match alerts.');
        setTimeout(() => {
          setIsOpen(false);
        }, 2200);
      } else {
        setStatusType('error');
        setStatusMessage(
          result.error ||
          (result.permission === 'denied'
            ? 'Notifications were denied in your browser settings.'
            : 'Unable to enable notifications.')
        );
      }
    } catch (err: any) {
      setStatusType('error');
      setStatusMessage(err.message || 'Failed to enable notifications.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const showIosInstructions = isIos() && !isStandalone();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1C1412] text-[#FAF7F0] border border-[#D4A72C]/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Decorative Gold Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F7D878] via-[#E5A93C] to-[#9B6B15]" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center text-[#F3D77A] shadow-gold shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <button
            onClick={handleDismiss}
            className="text-[#FAF7F0]/40 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1.5 flex items-center gap-2">
          <span>Stay Informed with Dehadak</span>
          <Sparkles className="w-4 h-4 text-[#F3D77A]" />
        </h3>

        <p className="text-xs sm:text-sm text-[#FAF7F0]/80 leading-relaxed mb-4">
          Stay informed about new compatible profiles, interest requests and messages directly on your device.
        </p>

        {showIosInstructions ? (
          <div className="bg-[#FAF7F0]/10 border border-[#D4A72C]/30 rounded-2xl p-3.5 mb-5 text-xs text-[#FAF7F0]/90 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#F3D77A]">
              <Smartphone className="w-4 h-4" />
              <span>iPhone / iPad Installation Required</span>
            </div>
            <p className="text-[11px] leading-normal text-[#FAF7F0]/70">
              Apple requires web apps to be on your Home Screen to receive push alerts.
            </p>
            <div className="flex items-center gap-2 text-[11px] bg-black/30 p-2 rounded-xl border border-[#D4A72C]/20">
              <Share2 className="w-3.5 h-3.5 text-[#F3D77A] shrink-0" />
              <span>Tap the <strong>Share</strong> button and choose <strong>"Add to Home Screen"</strong></span>
            </div>
          </div>
        ) : null}

        {statusMessage && (
          <div
            className={`p-3 rounded-2xl text-xs mb-4 flex items-center gap-2 ${
              statusType === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/50 text-rose-300'
            }`}
          >
            {statusType === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <X className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={handleEnableNotifications}
            className="w-full bg-gradient-to-r from-[#9B6B15] via-[#E5A93C] to-[#9B6B15] text-[#1C1412] hover:opacity-95 h-11 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enabling...</span>
              </>
            ) : (
              <span>Enable Notifications</span>
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleDismiss}
            className="w-full sm:w-auto px-5 h-11 rounded-2xl text-xs sm:text-sm font-semibold text-[#FAF7F0]/70 hover:text-white hover:bg-white/5 transition flex items-center justify-center cursor-pointer border border-[#D4A72C]/20"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
