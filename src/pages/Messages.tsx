import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Heart,
  Send,
  Check,
  X,
  Clock,
  ChevronRight,
  Search,
  Shield,
  ExternalLink,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'
import { getGenderAvatar } from '@/utils/avatar'
import { cleanPhotoUrl } from '@/utils/imageUrl'
import PackageBadge from '@/components/PackageBadge'
import QuotaUpgradeModal from '@/components/QuotaUpgradeModal'

interface Interest {
  id: number
  name: string
  age: number
  location: string
  profession?: string
  religion?: string
  gender?: string
  image: string
  time: string
  status: 'pending' | 'accepted' | 'declined'
  profileId?: number
  conversationId?: number
}

function getDisplayImage(photo?: string, gender?: string, isPrivate?: boolean): string {
  const fallback = getGenderAvatar(gender)
  if (isPrivate || !photo || !photo.trim()) return fallback
  const cleaned = cleanPhotoUrl(photo)
  return cleaned || fallback
}

interface MessagesPageProps {
  defaultTab?: "messages" | "received" | "sent"
}

export default function MessagesPage({ defaultTab }: MessagesPageProps = {}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const getTargetTab = (): 'messages' | 'received' | 'sent' => {
    if (defaultTab) return defaultTab
    if (location.pathname.startsWith('/matches')) return 'received'
    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get('tab')
    if (tabParam === 'received' || tabParam === 'sent' || tabParam === 'messages') {
      return tabParam
    }
    return 'messages'
  }

  const [activeTab, setActiveTab] = useState<'messages' | 'received' | 'sent'>(getTargetTab)

  useEffect(() => {
    const target = getTargetTab()
    if (target !== activeTab) {
      setActiveTab(target)
    }
  }, [defaultTab, location.pathname, location.search])
  const [selectedChat, setSelectedChat] = useState<number | null>(null)

  const [conversations, setConversations] = useState<any[]>([])
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [receivedInterests, setReceivedInterests] = useState<Interest[]>([])
  const [sentInterests, setSentInterests] = useState<Interest[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showGuestPrompt, setShowGuestPrompt] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quotaModal, setQuotaModal] = useState<{
    isOpen: boolean
    feature?: 'SEND_INTEREST' | 'ACCEPT_INTEREST' | 'MESSAGING_CONNECTION' | 'PREFERENCE_MATCH' | 'CONTACT_REVEAL'
    packageCode?: string
    message?: string
  }>({ isOpen: false })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat)
    }
  }, [selectedChat])

  const getHeaders = () => {
    const token = localStorage.getItem('dehadak_auth')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const getToken = () => localStorage.getItem('dehadak_auth')

  const decodeUserId = (token: string) => {
    try {
      const payload = token.split('.')[1]
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      const json = atob(base64)
      const parsed = JSON.parse(json)
      return Number(parsed.id)
    } catch {
      return null
    }
  }

  const formatTimeAgo = (value?: string) => {
    if (!value) return 'Recently'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Recently'

    const difference = Date.now() - date.getTime()
    const minutes = Math.floor(difference / 60000)
    const hours = Math.floor(difference / 3600000)
    const days = Math.floor(difference / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  const fetchData = async () => {
    try {
      const token = getToken()
      if (!token) {
        setShowGuestPrompt(true)
        setConversations([])
        setReceivedInterests([])
        setSentInterests([])
        setChatMessages([])
        return
      }

      setShowGuestPrompt(false)
      setIsLoading(true)
      setErrorMessage('')

      if (activeTab === 'messages') {
        const res = await fetch(`${API_BASE_URL}/api/messages/conversations`, { headers: getHeaders() })
        if (res.ok) {
          const data = await res.json()
          if (data.conversations && data.conversations.length > 0) {
            setConversations(data.conversations.map((c: any) => {
              return {
                id: c.id,
                name: c.name || 'Member',
                lastMessage: c.last_message || 'Conversation started',
                time: formatTimeAgo(c.last_message_at || c.created_at),
                unread: Number(c.unread_count || 0),
                image: getDisplayImage(c.photo, c.gender, false),
                gender: c.gender,
                otherUserId: c.other_user_id,
                packageCode: c.package_code,
                packageName: c.package_badge,
              }
            }))
          } else {
            setConversations([])
          }
        }
      } else if (activeTab === 'received') {
        const res = await fetch(`${API_BASE_URL}/api/interests/received`, { headers: getHeaders() })
        if (res.ok) {
          const data = await res.json()
          if (data.interests && data.interests.length > 0) {
            setReceivedInterests(data.interests.map((i: any) => {
              return {
                id: i.id,
                profileId: i.profile_id,
                name: `${i.first_name || ''} ${i.last_name || ''}`.trim() || 'Member',
                age: Number(new Date().getFullYear() - Number(i.birth_year || (new Date().getFullYear() - 26))),
                location: [i.district, i.city, i.country].filter(Boolean).join(', ') || 'Sri Lanka',
                profession: i.profession || 'Professional',
                religion: i.religion || 'Buddhist',
                gender: i.gender,
                image: getDisplayImage(i.photo, i.gender, i.photo_private),
                time: formatTimeAgo(i.created_at),
                status: i.status,
              }
            }))
          } else {
            setReceivedInterests([])
          }
        }
      } else if (activeTab === 'sent') {
        const res = await fetch(`${API_BASE_URL}/api/interests/sent`, { headers: getHeaders() })
        if (res.ok) {
          const data = await res.json()
          if (data.interests && data.interests.length > 0) {
            setSentInterests(data.interests.map((i: any) => {
              return {
                id: i.id,
                profileId: i.profile_id,
                name: `${i.first_name || ''} ${i.last_name || ''}`.trim() || 'Member',
                age: Number(new Date().getFullYear() - Number(i.birth_year || (new Date().getFullYear() - 26))),
                location: [i.district, i.city, i.country].filter(Boolean).join(', ') || 'Sri Lanka',
                profession: i.profession || 'Professional',
                religion: i.religion || 'Buddhist',
                gender: i.gender,
                image: getDisplayImage(i.photo, i.gender, i.photo_private),
                time: formatTimeAgo(i.created_at),
                status: i.status,
              }
            }))
          } else {
            setSentInterests([])
          }
        }
      }
    } catch (err) {
      console.error(err)
      setErrorMessage('Unable to load your connections.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptRequest = async (interestId: number) => {
    const token = getToken()
    if (!token) {
      setShowGuestPrompt(true)
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/interests/${interestId}/accept`, {
      method: 'PUT',
      headers: getHeaders(),
    })

    if (response.ok) {
      await fetchData()
      return
    }

    const data = await response.json().catch(() => ({}))
    if (response.status === 403 && data.code === 'PACKAGE_LIMIT_REACHED') {
      setQuotaModal({
        isOpen: true,
        feature: 'ACCEPT_INTEREST',
        message: data.message || data.error || 'Connection cannot be established because acceptance limit has been reached.',
      })
      return
    }
    setErrorMessage(data.error || 'Unable to accept request')
  }

  const handleDeclineRequest = async (interestId: number) => {
    const token = getToken()
    if (!token) {
      setShowGuestPrompt(true)
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/interests/${interestId}/decline`, {
      method: 'PUT',
      headers: getHeaders(),
    })

    if (response.ok) {
      await fetchData()
      return
    }

    const data = await response.json().catch(() => ({}))
    setErrorMessage(data.error || 'Unable to decline request')
  }

  const handleCancelInterest = async (interestId: number) => {
    const token = getToken()
    if (!token) {
      setShowGuestPrompt(true)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/interests/${interestId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })

      if (response.ok) {
        setSentInterests((prev) => prev.filter((i) => i.id !== interestId))
      } else {
        const data = await response.json().catch(() => ({}))
        setErrorMessage(data.error || 'Unable to cancel interest request')
      }
    } catch (err) {
      console.error('Cancel interest error:', err)
      setErrorMessage('Unable to cancel interest request')
    }
  }

  const fetchMessages = async (id: number) => {
    try {
      const token = getToken()
      if (!token) {
        setShowGuestPrompt(true)
        return
      }

      const res = await fetch(`${API_BASE_URL}/api/messages/conversations/${id}`, { headers: getHeaders() })
      if (res.ok) {
        setConversations((current) =>
          current.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
        )
        const data = await res.json()
        if (data.messages && data.messages.length > 0) {
          const myId = decodeUserId(token)
          
          setChatMessages(data.messages.map((m: any) => ({
            id: m.id,
            from: m.sender_id === myId ? 'me' : 'them',
            text: m.body,
            time: formatTimeAgo(m.created_at),
          })))
        } else {
          setChatMessages([])
        }
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data.error || 'Unable to load messages')
      }
    } catch (err) {
      console.error(err)
      setErrorMessage('Unable to load messages')
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return
    try {
      const token = getToken()
      if (!token) {
        setShowGuestPrompt(true)
        return
      }

      const res = await fetch(`${API_BASE_URL}/api/messages/conversations/${selectedChat}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ body: newMessage })
      })
      if (res.ok) {
        setNewMessage('')
        fetchMessages(selectedChat)
      } else {
        const data = await res.json().catch(() => ({}))
        if (res.status === 403 && data.code === 'PACKAGE_LIMIT_REACHED') {
          setQuotaModal({
            isOpen: true,
            feature: 'MESSAGING_CONNECTION',
            message: data.message || data.error || 'Free Explorer allows messaging only your 3 most recently active connections. Upgrade to unlock this conversation.',
          })
          return
        }
        setErrorMessage(data.error || 'Unable to send message')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const tabs = [
    { key: 'messages' as const, label: t('messages.tabs.messages'), icon: MessageCircle },
    { key: 'received' as const, label: t('messages.tabs.received'), icon: Heart },
    { key: 'sent' as const, label: t('messages.tabs.sent'), icon: Send },
  ]

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unread || 0), 0)
  const pendingInterestsCount = receivedInterests.filter((i) => i.status === 'pending').length
  const activeConv = conversations.find((c) => c.id === selectedChat)

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">{t('messages.title')}</h1>
          <p className="text-muted-foreground">
            {t('messages.subtitle')}
          </p>
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Tabs with Live Notification Badges */}
        <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 shadow-sm border border-[#EADFCF] mb-6 max-w-lg">
          {tabs.map((tab) => {
            const badgeCount =
              tab.key === 'messages'
                ? unreadMessagesCount
                : tab.key === 'received'
                  ? pendingInterestsCount
                  : 0

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  setSelectedChat(null)
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                  activeTab === tab.key
                    ? 'btn-gold shadow-sm'
                    : 'text-[#1C1412]/70 hover:text-[#1C1412] hover:bg-[#FAF6F0]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {badgeCount > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === tab.key
                        ? 'bg-[#1C1412] text-[#F7D878]'
                        : 'bg-rose-500 text-white animate-pulse'
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-6 h-[calc(100vh-280px)] min-h-[500px]"
            >
              {/* Conversation List */}
              <div className={`${selectedChat ? 'hidden md:block' : ''} w-full md:w-80 shrink-0 bg-white rounded-xl shadow-sm border border-[#EADFCF] overflow-hidden`}>
                <div className="p-4 border-b border-[#EADFCF]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1412]/50" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('messages.searchConversations')}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-[#EADFCF] text-[#1C1412] placeholder:text-[#1C1412]/50 text-sm focus:outline-none focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] transition-colors"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto h-[calc(100%-73px)] divide-y divide-[#EADFCF]/60">
                  {filteredConversations.length === 0 ? (
                    <div className="p-6 text-center text-sm text-[#1C1412]/50">
                      {searchQuery ? 'No conversations matching search' : 'No conversations yet'}
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedChat(conv.id)}
                        className={`w-full flex items-center gap-3.5 p-4 hover:bg-[#FAF6F0] transition-colors text-left ${
                          selectedChat === conv.id
                            ? 'bg-[#E5A93C]/10 border-l-4 border-[#E5A93C]'
                            : conv.unread > 0
                              ? 'bg-rose-50/30'
                              : ''
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={conv.image}
                            alt={conv.name}
                            className="w-12 h-12 rounded-full object-cover border border-[#EADFCF]"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = getGenderAvatar(conv.gender)
                            }}
                          />
                          {conv.unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-[#1C1412]' : 'font-semibold text-[#1C1412]/90'}`}>
                              {conv.name}
                            </span>
                            <span className="text-[11px] text-[#1C1412]/40 shrink-0">{conv.time}</span>
                          </div>
                          <p className={`text-xs truncate mt-0.5 ${conv.unread > 0 ? 'font-bold text-[#1C1412]' : 'text-[#1C1412]/60'}`}>
                            {conv.lastMessage}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className={`${selectedChat ? 'block' : 'hidden md:flex'} flex-1 bg-white rounded-xl shadow-sm border border-[#EADFCF] flex flex-col overflow-hidden`}>
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-[#EADFCF] bg-white">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="md:hidden p-2 -ml-2 rounded-full hover:bg-[#FAF6F0] text-[#1C1412]"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                      </button>
                      <img
                        src={activeConv?.image || getGenderAvatar(activeConv?.gender)}
                        alt={activeConv?.name || 'Chat'}
                        className="w-10 h-10 rounded-full object-cover border border-[#EADFCF]"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#1C1412]">{activeConv?.name || 'Verified Member'}</span>
                          {activeConv?.packageCode && (
                            <PackageBadge code={activeConv.packageCode} name={activeConv.packageName} size="sm" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Mutual Connection</span>
                        </div>
                      </div>
                    </div>

                    {/* Encryption Notice */}
                    <div className="px-4 py-2 bg-[#FAF6F0] border-b border-[#EADFCF]/50 text-center">
                      <p className="text-xs text-[#9B6B15] flex items-center justify-center gap-1 font-medium">
                        <Shield className="w-3.5 h-3.5" />
                        {t('messages.encrypted')}
                      </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF6F0]/40">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-2xs ${
                              msg.from === 'me'
                                ? 'bg-[#E5A93C] text-[#1C1412] font-medium rounded-br-md'
                                : 'bg-white text-[#1C1412] border border-[#EADFCF] rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-[#1C1412]/70' : 'text-[#1C1412]/50'}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[#EADFCF] bg-white">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder={t('messages.typeMessage')}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#EADFCF] text-[#1C1412] placeholder:text-[#1C1412]/50 text-sm focus:outline-none focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] transition-colors"
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="px-4 py-2.5 rounded-xl bg-[#E5A93C] text-[#1C1412] font-semibold text-sm hover:bg-[#F7D878] active:scale-95 transition-all shadow-xs flex items-center justify-center"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white">
                    <MessageCircle className="w-16 h-16 text-[#EADFCF] mb-4" />
                    <h3 className="font-semibold text-lg mb-2 text-[#1C1412]">{t('messages.selectConversation')}</h3>
                    <p className="text-sm text-[#1C1412]/60 max-w-xs">
                      {t('messages.selectConversationSubtitle')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'received' && (
            <motion.div
              key="received"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {receivedInterests.length > 0 ? (
                receivedInterests.map((interest) => (
                  <div
                    key={interest.id}
                    className="bg-white rounded-2xl shadow-card border border-[#EADFCF] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-[#E5A93C]/40 transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-[#E5A93C]/30 shrink-0 bg-[#FAF6F0]">
                        <img
                          src={interest.image}
                          alt={interest.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getGenderAvatar(interest.gender)
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-[#1C1412]">{interest.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5A93C]/15 text-[#9B6B15] border border-[#E5A93C]/30">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#1C1412]/75 font-medium">
                          {interest.age} years • {interest.location} • {interest.profession || 'Professional'}
                        </p>
                        <p className="text-xs text-[#1C1412]/50 font-sans">
                          Received {interest.time}
                        </p>
                        {interest.profileId && (
                          <Link
                            to={`/search?profileId=${interest.profileId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#9B6B15] hover:text-[#D4A72C] pt-1"
                          >
                            <span>View Full Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EADFCF]">
                      {interest.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleAcceptRequest(interest.id)}
                            className="flex-1 sm:flex-none btn-gold px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-gold hover:shadow-gold-lg"
                          >
                            <Check className="w-4 h-4" />
                            <span>Accept Interest</span>
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(interest.id)}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </>
                      ) : interest.status === 'accepted' ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            <span>Accepted</span>
                          </span>
                          <button
                            onClick={() => setActiveTab('messages')}
                            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold"
                          >
                            Open Chat
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                          <X className="w-3.5 h-3.5" />
                          <span>Declined</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#EADFCF] shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-[#9B6B15]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1412] mb-1">No Interests Received Yet</h3>
                  <p className="text-xs text-[#1C1412]/60 max-w-xs mx-auto">
                    When verified members send you interest requests, they will appear here with options to accept and connect.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {sentInterests.length > 0 ? (
                sentInterests.map((interest) => (
                  <div
                    key={interest.id}
                    className="bg-white rounded-2xl shadow-card border border-[#EADFCF] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-[#E5A93C]/40 transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-[#E5A93C]/30 shrink-0 bg-[#FAF6F0]">
                        <img
                          src={interest.image}
                          alt={interest.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getGenderAvatar(interest.gender)
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-[#1C1412]">{interest.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5A93C]/15 text-[#9B6B15] border border-[#E5A93C]/30">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#1C1412]/75 font-medium">
                          {interest.age} years • {interest.location} • {interest.profession || 'Professional'}
                        </p>
                        <p className="text-xs text-[#1C1412]/50 font-sans">
                          Sent {interest.time}
                        </p>
                        {interest.profileId && (
                          <Link
                            to={`/search?profileId=${interest.profileId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#9B6B15] hover:text-[#D4A72C] pt-1"
                          >
                            <span>View Full Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {interest.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Response</span>
                          </span>
                          <button
                            onClick={() => handleCancelInterest(interest.id)}
                            className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Cancel and release interest request"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                      {interest.status === 'accepted' && (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                            <span>Accepted!</span>
                          </span>
                          <button
                            onClick={() => setActiveTab('messages')}
                            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold"
                          >
                            Chat Now
                          </button>
                        </div>
                      )}
                      {interest.status === 'declined' && (
                        <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                          <X className="w-3.5 h-3.5" />
                          <span>Declined</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#EADFCF] shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-[#9B6B15]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1412] mb-1">No Sent Interests Yet</h3>
                  <p className="text-xs text-[#1C1412]/60 max-w-xs mx-auto mb-4">
                    Browse verified Sri Lankan proposals in search and send interest to start connecting.
                  </p>
                  <Link
                    to="/search"
                    className="btn-gold px-6 py-2.5 rounded-full text-xs font-bold inline-block"
                  >
                    Find Proposals
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {showGuestPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#EADFCF]">
              <h3 className="text-xl font-semibold mb-2 text-[#1C1412]">Login required</h3>
              <p className="text-sm text-[#1C1412]/70 mb-6">
                Guests can browse profiles, but requests and messages are available only after registration.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowGuestPrompt(false)
                    navigate('/login')
                  }}
                  className="flex-1 rounded-xl bg-gold px-4 py-3 font-semibold text-dark-bg hover:bg-gold-light transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowGuestPrompt(false)
                    navigate('/profile-creation')
                  }}
                  className="flex-1 rounded-xl border border-[#EADFCF] px-4 py-3 font-semibold text-[#1C1412] hover:bg-[#FAF6F0] transition-colors"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
        {isLoading && (
          <p className="mt-4 text-sm text-muted-foreground">Loading connections...</p>
        )}

        <QuotaUpgradeModal
          isOpen={quotaModal.isOpen}
          onClose={() => setQuotaModal({ isOpen: false })}
          feature={quotaModal.feature}
          packageCode={quotaModal.packageCode}
          message={quotaModal.message}
        />
      </div>
    </div>
  )
}
