import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Bell,
  CheckCheck,
  Check,
  Clock,
  Lock,
  User,
  SlidersHorizontal,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { API_BASE_URL } from '@/config';

export interface NotificationItem {
  id: number;
  eventType: string;
  candidateProfileId: number;
  title: string;
  body: string;
  candidateGender: string;
  actionUrl: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  candidateAvailable: boolean;
  candidateName: string | null;
  candidateAge: number | null;
  candidateReligion: string | null;
  candidateCivilStatus: string | null;
  photoUrl: string | null;
  isPhotoPrivate: boolean;
  matchPercentage: number | null;
}

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
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface NotificationDropdownProps {
  unreadCount: number;
  onRefreshSummary: () => void;
}

export default function NotificationDropdown({ unreadCount, onRefreshSummary }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('dehadak_auth');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/notifications?filter=${activeTab}&limit=8`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, activeTab]);

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
      onRefreshSummary();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
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
      onRefreshSummary();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      handleMarkAsRead(item.id);
    }
    setIsOpen(false);

    if (item.candidateAvailable && item.candidateProfileId) {
      navigate(`/search?profileId=${item.candidateProfileId}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full bg-black/30 border border-[#D4A72C]/30 hover:border-[#D4A72C] text-[#FAF7F0] hover:text-[#F3D77A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4A72C]/50"
          aria-label={`Notifications (${unreadCount} unread)`}
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-[#F3D77A]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse shadow-md border border-[#241A17]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 bg-[#241A17]/95 backdrop-blur-2xl border border-[#D4A72C]/30 shadow-luxury text-[#FAF7F0] p-0 rounded-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#1C1412]/80 border-b border-[#D4A72C]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#F3D77A]" />
            <h3 className="text-sm font-bold text-white tracking-wide">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A72C]/20 text-[#F3D77A] border border-[#D4A72C]/30">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="text-[11px] font-semibold text-[#D4A72C] hover:text-[#F3D77A] flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-[#D4A72C]/15 bg-black/20 px-3 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-2.5 font-medium transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-[#D4A72C] text-[#F3D77A] font-bold'
                : 'border-transparent text-[#FAF7F0]/60 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`pb-2 px-2.5 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'unread'
                ? 'border-[#D4A72C] text-[#F3D77A] font-bold'
                : 'border-transparent text-[#FAF7F0]/60 hover:text-white'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#D4A72C]/10">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#FAF7F0]/50 gap-2">
              <Loader2 className="w-5 h-5 text-[#D4A72C] animate-spin" />
              <p className="text-xs">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-[#D4A72C]/20 flex items-center justify-center mx-auto mb-2 text-[#D4A72C]">
                <Bell className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-xs font-semibold text-white">No notifications to show</p>
              <p className="text-[11px] text-[#FAF7F0]/50 mt-0.5">
                {activeTab === 'unread'
                  ? 'You are all caught up! No unread alerts.'
                  : 'New matrimonial profile alerts will appear here.'}
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3 transition-colors cursor-pointer flex gap-3 items-start group hover:bg-white/5 ${
                    !item.isRead ? 'bg-[#D4A72C]/[0.08]' : ''
                  }`}
                >
                  {/* Avatar / Icon */}
                  <div className="relative shrink-0 mt-0.5">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.candidateName || 'Member'}
                        className="w-10 h-10 rounded-full object-cover border border-[#D4A72C]/40 shadow-sm"
                      />
                    ) : item.isPhotoPrivate ? (
                      <div className="w-10 h-10 rounded-full bg-[#1C1412] border border-[#D4A72C]/30 flex items-center justify-center text-[#F3D77A]">
                        <Lock className="w-4 h-4 opacity-70" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/30 flex items-center justify-center text-[#F3D77A]">
                        <User className="w-5 h-5" />
                      </div>
                    )}

                    {!item.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D4A72C] ring-2 ring-[#241A17] shadow-sm" />
                    )}
                  </div>

                  {/* Body Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs ${!item.isRead ? 'font-bold text-white' : 'font-medium text-[#FAF7F0]/90'} truncate`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#FAF7F0]/40 shrink-0 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>

                    {item.candidateAvailable ? (
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        {item.candidateName && (
                          <span className="text-[11px] font-semibold text-[#F3D77A]">
                            {item.candidateName}
                            {item.candidateAge ? `, ${item.candidateAge} yrs` : ''}
                          </span>
                        )}

                        {item.matchPercentage !== null && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#D4A72C]/20 text-[#F3D77A] border border-[#D4A72C]/30">
                            {item.matchPercentage}% Match
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-400/80 italic flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        This profile is no longer available.
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                      <span className="text-[11px] text-[#D4A72C] group-hover:text-[#F3D77A] flex items-center gap-1 font-semibold">
                        View Profile
                        <ExternalLink className="w-3 h-3" />
                      </span>

                      {!item.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(item.id, e)}
                          title="Mark as read"
                          className="p-1 rounded text-[#FAF7F0]/40 hover:text-white hover:bg-white/10"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-[#1C1412] border-t border-[#D4A72C]/20 flex items-center justify-between text-xs">
          <Link
            to="/notifications"
            onClick={() => setIsOpen(false)}
            className="text-[#FAF7F0]/70 hover:text-[#F3D77A] font-medium transition-colors"
          >
            View All Notifications
          </Link>
          <Link
            to="/notifications?tab=settings"
            onClick={() => setIsOpen(false)}
            className="text-[#D4A72C] hover:text-[#F3D77A] flex items-center gap-1 font-semibold transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Settings</span>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
