import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
} from 'lucide-react'

interface Interest {
  id: number
  name: string
  age: number
  location: string
  image: string
  time: string
  status: 'pending' | 'accepted' | 'declined'
}

const receivedInterests: Interest[] = [
  {
    id: 1,
    name: 'Dilini P.',
    age: 28,
    location: 'Kandy',
    image: '/profile-female-1.jpg',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Nadeesha W.',
    age: 26,
    location: 'Galle',
    image: '/profile-female-2.jpg',
    time: '1 day ago',
    status: 'pending',
  },
]

const sentInterests: Interest[] = [
  {
    id: 3,
    name: 'Rukmal S.',
    age: 31,
    location: 'Digana',
    image: '/profile-male-1.jpg',
    time: '3 hours ago',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Isuri K.',
    age: 27,
    location: 'Kurunegala',
    image: '/profile-female-3.jpg',
    time: '2 days ago',
    status: 'accepted',
  },
]

const conversations = [
  {
    id: 1,
    name: 'Dilini P.',
    lastMessage: 'Thank you for your interest. I would love to know more about you.',
    time: '10 min ago',
    unread: 2,
    image: '/profile-female-1.jpg',
  },
  {
    id: 2,
    name: 'Isuri K.',
    lastMessage: 'My family is also from Kurunegala! What a coincidence.',
    time: '2 hours ago',
    unread: 0,
    image: '/profile-female-3.jpg',
  },
]

const chatMessages = [
  { id: 1, from: 'them', text: 'Hello! I noticed your profile and wanted to reach out.', time: '10:30 AM' },
  { id: 2, from: 'me', text: 'Hi! Thank you for showing interest. I am glad to connect.', time: '10:32 AM' },
  { id: 3, from: 'them', text: 'I read that you are an engineer in Colombo. I am also in the IT field.', time: '10:35 AM' },
  { id: 4, from: 'me', text: 'That is wonderful! Where do you work if you do not mind me asking?', time: '10:38 AM' },
  { id: 5, from: 'them', text: 'I work at a software company in Kandy. I have been there for 3 years now.', time: '10:40 AM' },
]

export default function MessagesPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'messages' | 'received' | 'sent'>('messages')
  const [selectedChat, setSelectedChat] = useState<number | null>(null)

  const tabs = [
    { key: 'messages' as const, label: t('messages.tabs.messages'), icon: MessageCircle },
    { key: 'received' as const, label: t('messages.tabs.received'), icon: Heart },
    { key: 'sent' as const, label: t('messages.tabs.sent'), icon: Send },
  ]

  return (
    <div className="min-h-screen bg-light-bg pt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">{t('messages.title')}</h1>
          <p className="text-muted-foreground">
            {t('messages.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-light-border mb-6 max-w-md">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key)
                setSelectedChat(null)
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gold text-dark-bg shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
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
              <div className={`${selectedChat ? 'hidden md:block' : ''} w-full md:w-80 shrink-0 bg-white rounded-xl shadow-sm border border-light-border overflow-hidden`}>
                <div className="p-4 border-b border-light-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('messages.searchConversations')}
                      className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg border border-light-border text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto h-[calc(100%-65px)]">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedChat(conv.id)}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-light-bg transition-colors border-b border-light-border last:border-0 ${
                        selectedChat === conv.id ? 'bg-gold/5' : ''
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={conv.image}
                          alt={conv.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conv.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-dark-bg text-xs font-bold flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{conv.name}</span>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className={`${selectedChat ? 'block' : 'hidden md:flex'} flex-1 bg-white rounded-xl shadow-sm border border-light-border flex flex-col overflow-hidden`}>
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-light-border">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="md:hidden p-2 -ml-2 rounded-full hover:bg-light-bg"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                      </button>
                      <img
                        src="/profile-female-1.jpg"
                        alt="Chat"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-medium text-sm">Dilini P.</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Shield className="w-3 h-3" />
                          {t('messages.verifiedAccount')}
                        </div>
                      </div>
                    </div>

                    {/* Encryption Notice */}
                    <div className="px-4 py-2 bg-blue-50 text-center">
                      <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />
                        {t('messages.encrypted')}
                      </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                              msg.from === 'me'
                                ? 'bg-gold text-dark-bg rounded-br-md'
                                : 'bg-light-bg text-foreground rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-dark-bg/60' : 'text-muted-foreground'}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-light-border">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t('messages.typeMessage')}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-light-bg border border-light-border text-sm focus:outline-none focus:border-gold transition-colors"
                        />
                        <button className="px-4 py-2.5 rounded-xl bg-gold text-dark-bg font-medium text-sm hover:bg-gold-light transition-colors">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <MessageCircle className="w-16 h-16 text-light-border mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{t('messages.selectConversation')}</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
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
                    className="bg-white rounded-xl shadow-sm border border-light-border p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <img
                      src={interest.image}
                      alt={interest.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{interest.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {interest.age} years • {interest.location}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('messages.interested', { time: interest.time })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-dark-bg font-semibold text-sm hover:bg-gold-light transition-colors">
                        <Check className="w-4 h-4" />
                        {t('messages.accept')}
                      </button>
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-light-border text-muted-foreground font-medium text-sm hover:bg-light-bg transition-colors">
                        <X className="w-4 h-4" />
                        {t('messages.decline')}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 text-light-border mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{t('messages.noReceivedTitle')}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    {t('messages.noReceivedSubtitle')}
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
                    className="bg-white rounded-xl shadow-sm border border-light-border p-4 md:p-6 flex items-center gap-4"
                  >
                    <img
                      src={interest.image}
                      alt={interest.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{interest.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {interest.age} years • {interest.location}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('messages.sent', { time: interest.time })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {interest.status === 'pending' && (
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          {t('messages.pending')}
                        </span>
                      )}
                      {interest.status === 'accepted' && (
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                          <Check className="w-3 h-3" />
                          {t('messages.accepted')}
                        </span>
                      )}
                      {interest.status === 'declined' && (
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                          <X className="w-3 h-3" />
                          {t('messages.declined')}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <Send className="w-16 h-16 text-light-border mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{t('messages.noSentTitle')}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    {t('messages.noSentSubtitle')}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
