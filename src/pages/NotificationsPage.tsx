import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import {
  Bell,
  CheckCheck,
  Check,
  Clock,
  Lock,
  SlidersHorizontal,
  ExternalLink,
  Loader2,
  AlertCircle,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle,
  MapPin,
  Eye,
  EyeOff,
  Moon,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { API_BASE_URL } from '@/config';
import {
  getPushPermissionState,
  subscribeUserToPush,
  unsubscribeUserFromPush,
} from '@/utils/pushManager';
import { getGenderAvatar } from '@/utils/avatar';
import type { NotificationItem } from '@/components/NotificationDropdown';

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'all' | 'unread' | 'settings') || 'all';

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>(initialTab);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

  // Settings State
  const [newProfileInApp, setNewProfileInApp] = useState(true);
  const [newProfilePush, setNewProfilePush] = useState(false);
  const [interestsInApp, setInterestsInApp] = useState(true);
  const [interestsPush, setInterestsPush] = useState(false);
  const [messagesInApp, setMessagesInApp] = useState(true);
  const [messagesPush, setMessagesPush] = useState(false);
  const [paymentInApp, setPaymentInApp] = useState(true);
  const [paymentPush, setPaymentPush] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [previewMode, setPreviewMode] = useState<'discreet' | 'detailed'>('discreet');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);

  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');
  const [pushStatusMessage, setPushStatusMessage] = useState('');
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [subscribingPush, setSubscribingPush] = useState(false);

  useEffect(() => {
    setPushPermission(getPushPermissionState());
  }, []);

  // Sync tab with URL
  const changeTab = (tab: 'all' | 'unread' | 'settings') => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setPage(1);
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem('dehadak_auth');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const filter = activeTab === 'unread' ? 'unread' : 'all';
      const res = await fetch(
        `${API_BASE_URL}/api/notifications?filter=${filter}&page=${page}&limit=12`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    const token = localStorage.getItem('dehadak_auth');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNewProfileInApp(data.newProfileInApp !== false);
        setNewProfilePush(Boolean(data.newProfilePush));
        setInterestsInApp(data.interestsInApp !== false);
        setInterestsPush(Boolean(data.interestsPush));
        setMessagesInApp(data.messagesInApp !== false);
        setMessagesPush(Boolean(data.messagesPush));
        setPaymentInApp(data.paymentInApp !== false);
        setPaymentPush(Boolean(data.paymentPush));
        setPushEnabled(Boolean(data.pushEnabled));
        setEmailEnabled(data.emailEnabled !== false);
        setPreviewMode(data.previewMode === 'detailed' ? 'detailed' : 'discreet');
        setQuietHoursEnabled(data.quietHoursEnabled !== false);
        setHasActiveSubscription(Boolean(data.hasActiveSubscription));
      }
    } catch (err) {
      console.error('Error fetching notification preferences:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchPreferences();
    } else {
      fetchNotifications();
    }
  }, [activeTab, page]);

  const handleMarkAsRead = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem('dehadak_auth');
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem('dehadak_auth');
    if (!token) return;

    setMarkingAll(true);
    try {
      await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      handleMarkAsRead(item.id);
    }

    if (item.candidateAvailable && item.candidateProfileId) {
      navigate(`/search?profileId=${item.candidateProfileId}`);
    } else {
      navigate('/search');
    }
  };

  const handleSavePreferences = async () => {
    const token = localStorage.getItem('dehadak_auth');
    if (!token) return;

    setSavingSettings(true);
    setSettingsSavedMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newProfileInApp,
          newProfilePush,
          interestsInApp,
          interestsPush,
          messagesInApp,
          messagesPush,
          paymentInApp,
          paymentPush,
          pushEnabled,
          emailEnabled,
          previewMode,
          quietHoursEnabled,
        }),
      });

      if (res.ok) {
        setSettingsSavedMessage('Preferences updated successfully.');
        setTimeout(() => setSettingsSavedMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleEnablePush = async () => {
    const token = localStorage.getItem('dehadak_auth');
    if (!token) return;

    setSubscribingPush(true);
    setPushStatusMessage('');
    try {
      const result = await subscribeUserToPush(token);
      setPushPermission(result.permission);

      if (result.success) {
        setNewProfilePush(true);
        setPushEnabled(true);
        setHasActiveSubscription(true);
        setPushStatusMessage('Push notifications enabled for this device.');
      } else {
        setPushStatusMessage(result.error || 'Failed to enable push notifications.');
      }
    } catch (err: any) {
      setPushStatusMessage(err.message || 'Error subscribing to push.');
    } finally {
      setSubscribingPush(false);
    }
  };

  const handleDisablePush = async () => {
    const token = localStorage.getItem('dehadak_auth');
    if (!token) return;

    setSubscribingPush(true);
    setPushStatusMessage('');
    try {
      await unsubscribeUserFromPush(token);
      setNewProfilePush(false);
      setPushEnabled(false);
      setHasActiveSubscription(false);
      setPushStatusMessage('Push notifications disabled for this device.');
    } catch (err: any) {
      setPushStatusMessage(err.message || 'Error disabling push.');
    } finally {
      setSubscribingPush(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1412] text-[#FAF7F0] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#FAF7F0]/60 mb-6">
          <Link to="/" className="hover:text-[#F3D77A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#F3D77A] font-semibold">Notifications</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D4A72C]/20 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A72C]/20 border border-[#D4A72C]/40 flex items-center justify-center text-[#F3D77A] shadow-gold">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
                Notifications & Alerts
              </h1>
              <p className="text-xs text-[#FAF7F0]/60 mt-0.5">
                Stay informed with system-generated matrimonial updates and new profile releases.
              </p>
            </div>
          </div>

          {activeTab !== 'settings' && unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#D4A72C]/20 text-[#F3D77A] border border-[#D4A72C]/40 hover:bg-[#D4A72C]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {/* Primary Filter Tabs */}
        <div className="flex border-b border-[#D4A72C]/20 mb-6 gap-2">
          <button
            onClick={() => changeTab('all')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'all'
                ? 'border-[#D4A72C] text-[#F3D77A]'
                : 'border-transparent text-[#FAF7F0]/60 hover:text-white'
            }`}
          >
            All Alerts ({totalCount})
          </button>
          <button
            onClick={() => changeTab('unread')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'unread'
                ? 'border-[#D4A72C] text-[#F3D77A]'
                : 'border-transparent text-[#FAF7F0]/60 hover:text-white'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => changeTab('settings')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-[#D4A72C] text-[#F3D77A]'
                : 'border-transparent text-[#FAF7F0]/60 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Settings & Privacy</span>
          </button>
        </div>

        {/* Tab Content: Notifications List */}
        {activeTab !== 'settings' && (
          <div>
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 text-[#D4A72C] animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#FAF7F0]/60">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-24 text-center bg-[#241A17]/60 rounded-3xl border border-[#D4A72C]/20 p-8">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-[#D4A72C]/30 flex items-center justify-center mx-auto mb-4 text-[#D4A72C]">
                  <Bell className="w-7 h-7 opacity-50" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {activeTab === 'unread' ? 'All Caught Up!' : 'No Notifications Yet'}
                </h3>
                <p className="text-xs text-[#FAF7F0]/60 max-w-sm mx-auto mb-6">
                  {activeTab === 'unread'
                    ? 'You have read all your alerts. When new matrimonial profiles become discoverable, they will appear here.'
                    : 'System-generated alerts for new bride and groom profiles will appear here as soon as they are published.'}
                </p>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 btn-gold px-6 py-2.5 rounded-xl text-xs font-bold shadow-md"
                >
                  Explore Search
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((item) => {
                  const genderAvatar = getGenderAvatar(item.candidateGender);

                  const displayPhoto = (!item.isPhotoPrivate && item.photoUrl) ? item.photoUrl : genderAvatar;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start group hover:border-[#D4A72C]/60 hover:bg-white/5 ${
                        !item.isRead
                          ? 'bg-[#241A17]/90 border-[#D4A72C]/40 shadow-sm'
                          : 'bg-[#1E1614]/60 border-[#D4A72C]/15 opacity-90'
                      }`}
                    >
                      {/* Candidate Avatar with photo privacy lock badge */}
                      <div className="relative shrink-0">
                        <img
                          src={displayPhoto}
                          alt={item.candidateName || 'Member'}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#D4A72C]/40 shadow-sm bg-[#1C1412]"
                        />

                        {item.isPhotoPrivate && (
                          <div
                            title="Photo is privacy protected"
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1C1412] border border-[#D4A72C] flex items-center justify-center text-[#F3D77A]"
                          >
                            <Lock className="w-3 h-3" />
                          </div>
                        )}

                        {!item.isRead && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#D4A72C] ring-2 ring-[#1C1412] shadow-sm animate-pulse" />
                        )}
                      </div>

                      {/* Notification Body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4
                            className={`text-sm ${
                              !item.isRead ? 'font-bold text-white' : 'font-medium text-[#FAF7F0]/90'
                            } truncate`}
                          >
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-[#FAF7F0]/40 shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo(item.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-[#FAF7F0]/70 mb-2">
                          {item.body}
                        </p>

                        {item.candidateAvailable ? (
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            {item.candidateName && (
                              <span className="text-xs font-semibold text-[#F3D77A]">
                                {item.candidateName}
                                {item.candidateAge ? `, ${item.candidateAge} yrs` : ''}
                              </span>
                            )}

                            {item.isVerified && (
                              <span
                                title="Genuine NIC Verified Member"
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            )}

                            {item.candidateLocation && (
                              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#FAF7F0]/70 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#D4A72C]/70" />
                                <span>{item.candidateLocation}</span>
                              </span>
                            )}

                            {item.candidateReligion && (
                              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#FAF7F0]/70">
                                {item.candidateReligion}
                              </span>
                            )}

                            {item.matchPercentage !== null && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D4A72C]/20 text-[#F3D77A] border border-[#D4A72C]/30">
                                {item.matchPercentage}% Preference Match
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-amber-400/80 italic flex items-center gap-1 mb-3">
                            <AlertCircle className="w-3.5 h-3.5" />
                            This profile is no longer available.
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-xs font-bold text-[#D4A72C] group-hover:text-[#F3D77A] flex items-center gap-1.5 transition-colors">
                            View Candidate Profile
                            <ExternalLink className="w-3.5 h-3.5" />
                          </span>

                          {!item.isRead && (
                            <button
                              onClick={(e) => handleMarkAsRead(item.id, e)}
                              className="text-xs text-[#FAF7F0]/50 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark as read</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-[#D4A72C]/20 mt-6 text-xs">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-[#D4A72C]/30 text-[#FAF7F0]/80 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="text-[#FAF7F0]/60">
                      Page <strong className="text-white">{page}</strong> of{' '}
                      <strong className="text-white">{totalPages}</strong>
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-xl border border-[#D4A72C]/30 text-[#FAF7F0]/80 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Settings & Privacy */}
        {activeTab === 'settings' && (
          <div className="bg-[#241A17]/80 rounded-3xl border border-[#D4A72C]/30 p-6 sm:p-8 shadow-luxury space-y-8">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide mb-1">
                Notification & Privacy Preferences
              </h3>
              <p className="text-xs text-[#FAF7F0]/60">
                Configure lock-screen privacy, quiet hours, and when you wish to receive matrimonial match alerts.
              </p>
            </div>

            {/* Notification Preview Mode (Requirement 6) */}
            <div className="p-5 rounded-2xl bg-black/20 border border-[#D4A72C]/20 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-[#F3D77A]" />
                <h4>Phone Lock-Screen Preview Mode</h4>
              </div>
              <p className="text-xs text-[#FAF7F0]/60">
                Choose how notifications appear on your phone lock screen.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label
                  onClick={() => setPreviewMode('discreet')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    previewMode === 'discreet'
                      ? 'border-[#D4A72C] bg-[#D4A72C]/15 shadow-sm'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-[#F3D77A]" />
                      <span>Discreet (Recommended)</span>
                    </span>
                    <input
                      type="radio"
                      name="previewMode"
                      value="discreet"
                      checked={previewMode === 'discreet'}
                      onChange={() => setPreviewMode('discreet')}
                      className="accent-[#D4A72C]"
                    />
                  </div>
                  <p className="text-[11px] text-[#FAF7F0]/70 leading-relaxed">
                    Hides names, ages, and photos on your lock screen for maximum matrimonial confidentiality.
                  </p>
                </label>

                <label
                  onClick={() => setPreviewMode('detailed')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    previewMode === 'detailed'
                      ? 'border-[#D4A72C] bg-[#D4A72C]/15 shadow-sm'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#F3D77A]" />
                      <span>Detailed</span>
                    </span>
                    <input
                      type="radio"
                      name="previewMode"
                      value="detailed"
                      checked={previewMode === 'detailed'}
                      onChange={() => setPreviewMode('detailed')}
                      className="accent-[#D4A72C]"
                    />
                  </div>
                  <p className="text-[11px] text-[#FAF7F0]/70 leading-relaxed">
                    Displays candidate first name, age, and permitted public photo thumbnail directly in phone alerts.
                  </p>
                </label>
              </div>
            </div>

            {/* Quiet Hours (Requirement 12) */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-[#D4A72C]/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-[#F3D77A]" />
                  <h4 className="text-sm font-semibold text-white">
                    Sri Lanka Quiet Hours (22:00 – 07:00)
                  </h4>
                </div>
                <p className="text-xs text-[#FAF7F0]/60 max-w-lg">
                  Automatically silence late-night promotional and new-profile push notifications during sleeping hours (Asia/Colombo timezone).
                </p>
              </div>
              <Switch
                checked={quietHoursEnabled}
                onCheckedChange={setQuietHoursEnabled}
              />
            </div>

            {/* Push Settings (Device Push) */}
            <div className="p-5 rounded-2xl bg-black/20 border border-[#D4A72C]/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#F3D77A]" />
                    <h4 className="text-sm font-semibold text-white">
                      PWA Phone Push Alerts
                    </h4>
                  </div>
                  <p className="text-xs text-[#FAF7F0]/60 max-w-lg">
                    Receive background notifications on this device even when the Dehadak app is closed.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {hasActiveSubscription ? (
                    <button
                      type="button"
                      onClick={handleDisablePush}
                      disabled={subscribingPush}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 cursor-pointer disabled:opacity-50"
                    >
                      {subscribingPush ? 'Updating...' : 'Disable on this device'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEnablePush}
                      disabled={subscribingPush}
                      className="btn-gold px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md"
                    >
                      {subscribingPush ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Requesting...</span>
                        </>
                      ) : (
                        <span>Enable Push Alerts</span>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Push Status Info */}
              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#FAF7F0]/50">Browser Permission:</span>
                  {pushPermission === 'granted' ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                    </span>
                  ) : pushPermission === 'denied' ? (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Blocked in Browser
                    </span>
                  ) : pushPermission === 'unsupported' ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Unsupported
                    </span>
                  ) : (
                    <span className="text-white/70 font-semibold">Not Requested</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#FAF7F0]/50">Device Subscription:</span>
                  <span
                    className={`font-semibold ${
                      hasActiveSubscription ? 'text-emerald-400' : 'text-white/60'
                    }`}
                  >
                    {hasActiveSubscription ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {pushStatusMessage && (
                <div className="p-3 rounded-xl bg-white/5 border border-[#D4A72C]/30 text-xs text-[#F3D77A]">
                  {pushStatusMessage}
                </div>
              )}
            </div>

            {/* Granular Notification Channels & Categories (Requirement 10) */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white tracking-wide">
                Category Alerts
              </h4>

              <div className="space-y-3">
                {/* New Compatible Profiles */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-[#D4A72C]/20">
                  <div className="space-y-0.5">
                    <h5 className="text-xs sm:text-sm font-semibold text-white">
                      New Compatible Profiles
                    </h5>
                    <p className="text-[11px] text-[#FAF7F0]/60">
                      Receive notifications when newly approved members matching your preferences join.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-[#FAF7F0]/70 flex items-center gap-2">
                      <span>In-App</span>
                      <Switch
                        checked={newProfileInApp}
                        onCheckedChange={setNewProfileInApp}
                      />
                    </label>
                    <label className="text-xs text-[#FAF7F0]/70 flex items-center gap-2">
                      <span>Push</span>
                      <Switch
                        checked={newProfilePush}
                        onCheckedChange={setNewProfilePush}
                      />
                    </label>
                  </div>
                </div>

                {/* Interest Requests */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-[#D4A72C]/20">
                  <div className="space-y-0.5">
                    <h5 className="text-xs sm:text-sm font-semibold text-white">
                      Interest Requests & Acceptances
                    </h5>
                    <p className="text-[11px] text-[#FAF7F0]/60">
                      Alerts when another member sends or accepts an interest request.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-[#FAF7F0]/70 flex items-center gap-2">
                      <span>In-App</span>
                      <Switch
                        checked={interestsInApp}
                        onCheckedChange={setInterestsInApp}
                      />
                    </label>
                    <label className="text-xs text-[#FAF7F0]/70 flex items-center gap-2">
                      <span>Push</span>
                      <Switch
                        checked={interestsPush}
                        onCheckedChange={setInterestsPush}
                      />
                    </label>
                  </div>
                </div>

                {/* New Messages */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-[#D4A72C]/20">
                  <div className="space-y-0.5">
                    <h5 className="text-xs sm:text-sm font-semibold text-white">
                      Messages & Chat Alerts
                    </h5>
                    <p className="text-[11px] text-[#FAF7F0]/60">
                      Alerts when a connected matrimonial match sends you a new chat message.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-[#FAF7F0]/70 flex items-center gap-2">
                      <span>In-App</span>
                      <Switch
                        checked={messagesInApp}
                        onCheckedChange={setMessagesInApp}
                      />
                    </label>
                    <label className="text-xs text-[#FAF7F0]/70 flex items-center gap-2">
                      <span>Push</span>
                      <Switch
                        checked={messagesPush}
                        onCheckedChange={setMessagesPush}
                      />
                    </label>
                  </div>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-[#D4A72C]/20">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#F3D77A]" />
                      <h5 className="text-xs sm:text-sm font-semibold text-white">
                        Email Notifications
                      </h5>
                    </div>
                    <p className="text-[11px] text-[#FAF7F0]/60">
                      Receive important account and matrimonial match summaries to your registered Gmail.
                    </p>
                  </div>
                  <Switch
                    checked={emailEnabled}
                    onCheckedChange={setEmailEnabled}
                  />
                </div>
              </div>
            </div>

            {/* Platform Guidance Note */}
            <div className="p-4 rounded-2xl bg-[#D4A72C]/[0.06] border border-[#D4A72C]/20 flex gap-3 text-xs text-[#FAF7F0]/70">
              <Info className="w-5 h-5 text-[#D4A72C] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">Platform-Specific Guidance</p>
                <ul className="list-disc list-inside space-y-0.5 text-[#FAF7F0]/60 text-[11px]">
                  <li><strong>Android / Chrome / Edge:</strong> Push alerts work directly through your browser or installed PWA.</li>
                  <li><strong>Apple iOS (iPhone / iPad):</strong> Requires iOS 16.4+. You must add Dehadak to your Home Screen via Safari (tap Share → "Add to Home Screen") to enable lock-screen Web Push.</li>
                  <li><strong>Matrimonial Privacy Guarantee:</strong> In Discreet mode, phone alerts never show names, ages, photos, religion, or NIC details.</li>
                </ul>
              </div>
            </div>

            {/* Save Preferences Button */}
            <div className="pt-4 border-t border-[#D4A72C]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              {settingsSavedMessage ? (
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {settingsSavedMessage}
                </p>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={savingSettings}
                className="btn-gold px-8 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {savingSettings ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save Notification Preferences</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
