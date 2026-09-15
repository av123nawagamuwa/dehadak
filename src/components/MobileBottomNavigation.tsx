import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import {
  Home,
  Search,
  Heart,
  MessageCircle,
  User,
} from "lucide-react"
import { API_BASE_URL } from "@/config"

interface NavItem {
  id: "home" | "search" | "matches" | "messages" | "profile"
  path: string
  labelKey: string
  defaultLabel: string
  icon: React.ElementType
  isProtected: boolean
}

export default function MobileBottomNavigation() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const [unreadMessages, setUnreadMessages] = useState<number>(0)
  const [pendingInterests, setPendingInterests] = useState<number>(0)

  // Five Navigation Items as specified
  const navItems: NavItem[] = [
    {
      id: "home",
      path: "/",
      labelKey: "nav.home",
      defaultLabel: "Home",
      icon: Home,
      isProtected: false,
    },
    {
      id: "search",
      path: "/search",
      labelKey: "nav.search",
      defaultLabel: "Search",
      icon: Search,
      isProtected: false,
    },
    {
      id: "matches",
      path: "/matches",
      labelKey: "nav.matches",
      defaultLabel: "Matches",
      icon: Heart,
      isProtected: true,
    },
    {
      id: "messages",
      path: "/messages",
      labelKey: "nav.messages",
      defaultLabel: "Messages",
      icon: MessageCircle,
      isProtected: true,
    },
    {
      id: "profile",
      path: "/profile",
      labelKey: "nav.profile",
      defaultLabel: "Profile",
      icon: User,
      isProtected: true,
    },
  ]

  // Determine active state strictly based on route
  const isItemActive = (item: NavItem): boolean => {
    const pathname = location.pathname
    const search = location.search

    switch (item.id) {
      case "home":
        return pathname === "/"
      case "search":
        return pathname.startsWith("/search")
      case "matches":
        return (
          pathname === "/matches" ||
          (pathname === "/messages" && search.includes("tab=received"))
        )
      case "messages":
        return (
          pathname.startsWith("/messages") &&
          !search.includes("tab=received") &&
          pathname !== "/matches"
        )
      case "profile":
        return pathname.startsWith("/profile")
      default:
        return false
    }
  }

  // Fetch genuine notification badge data from backend when logged in
  const fetchBadgeCounts = () => {
    const token = localStorage.getItem("dehadak_auth")
    if (!token) {
      setUnreadMessages(0)
      setPendingInterests(0)
      return
    }

    fetch(`${API_BASE_URL}/api/messages/notifications/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch summary")
        return res.json()
      })
      .then((data) => {
        if (data) {
          setUnreadMessages(Number(data.unreadMessages) || 0)
          setPendingInterests(Number(data.pendingInterests) || 0)
        }
      })
      .catch(() => {
        // Silent failure - never show fake badges
      })
  }

  useEffect(() => {
    fetchBadgeCounts()
    const timer = setInterval(fetchBadgeCounts, 15000)
    return () => clearInterval(timer)
  }, [location.pathname])

  // Authentication guard with destination preservation
  const handleItemClick = (item: NavItem) => {
    const token = localStorage.getItem("dehadak_auth")

    if (item.isProtected && !token) {
      navigate("/login", { state: { from: item.path } })
      return
    }

    navigate(item.path)
  }

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#1C1412]/95 backdrop-blur-xl border-t border-[#E5A93C]/20 shadow-[0_-4px_25px_rgba(0,0,0,0.35)] select-none w-full"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Subtle top gold accent line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5A93C]/40 to-transparent pointer-events-none" />

      <div className="grid grid-cols-5 w-full h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const active = isItemActive(item)
          const Icon = item.icon
          const label = t(item.labelKey) || item.defaultLabel

          const hasMessageBadge = item.id === "messages" && unreadMessages > 0
          const hasMatchesBadge = item.id === "matches" && pendingInterests > 0

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`w-full h-full min-h-[44px] flex flex-col items-center justify-center py-1 relative transition-colors duration-200 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E5A93C] rounded-xl ${
                active
                  ? "text-[#F7D878]"
                  : "text-[#FAF7F0]/60 hover:text-[#FAF7F0]/90"
              }`}
            >
              <div
                className={`relative flex items-center justify-center px-2.5 py-1 rounded-xl transition-all duration-200 ${
                  active ? "bg-[#E5A93C]/15" : "group-hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active
                      ? "text-[#F7D878] scale-105 stroke-[2.25]"
                      : "text-[#FAF7F0]/70 group-hover:text-[#FAF7F0]/90 stroke-[1.75]"
                  }`}
                />

                {/* Messages Unread Badge */}
                {hasMessageBadge && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-[#1C1412] leading-none animate-pulse">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                )}

                {/* Matches Pending Badge */}
                {hasMatchesBadge && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#E5A93C] text-[9px] font-bold text-[#1C1412] shadow-sm ring-2 ring-[#1C1412] leading-none">
                    {pendingInterests > 9 ? "9+" : pendingInterests}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight truncate max-w-[62px] text-center mt-0.5 leading-tight transition-colors duration-200 ${
                  active
                    ? "font-bold text-[#F7D878]"
                    : "font-medium text-[#FAF7F0]/65 group-hover:text-[#FAF7F0]/90"
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
