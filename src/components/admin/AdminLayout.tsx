import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  ShieldCheck,
  Users,
  LayoutDashboard,
  LogOut,
  BadgeCheck,
  Menu,
  X,
} from 'lucide-react'
import { API_BASE_URL } from '@/config'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [adminUser, setAdminUser] = useState<any>(null)
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('dehadak_admin_auth')
    if (!token) {
      navigate('/admin/login', { replace: true })
      return
    }

    try {
      const storedUser = localStorage.getItem('dehadak_admin_user')
      if (storedUser) {
        setAdminUser(JSON.parse(storedUser))
      }
    } catch {}

    // Fetch stats to get pending count
    fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('dehadak_admin_auth')
          localStorage.removeItem('dehadak_admin_user')
          navigate('/admin/login', { replace: true })
        }
        return res.json()
      })
      .then((data) => {
        if (data && data.stats) {
          setPendingCount(Number(data.stats.pending_verifications) || 0)
        }
      })
      .catch(() => {})
  }, [navigate, location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('dehadak_admin_auth')
    localStorage.removeItem('dehadak_admin_user')
    navigate('/admin/login', { replace: true })
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'NIC Verifications',
      href: '/admin/verifications',
      icon: BadgeCheck,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      label: 'Profile Directory',
      href: '/admin/profiles',
      icon: Users,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1C1412] flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-[#1C1412] border-b border-[#E5A93C]/30 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#E5A93C]/70 shadow-gold bg-[#1C1412] flex items-center justify-center p-0.5 shrink-0">
              <img src="/logo.png" alt="Dehadak" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-white tracking-wide">Dehadak</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#1C1412] shadow-xs">
                  Admin Portal
                </span>
              </div>
              <p className="text-[10px] text-[#F7D878]/80 hidden sm:block">
                Secure Moderation & Verification Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">
                {adminUser?.first_name ? `${adminUser.first_name} ${adminUser.last_name || ''}` : 'Administrator'}
              </span>
              <span className="text-[10px] text-[#F7D878]/70">{adminUser?.email || 'admin@dehadak.lk'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-xs font-semibold text-white/90 border border-white/15 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#241A17] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#E5A93C] text-[#1C1412] shadow-sm'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1C1412]/50">
            Navigation
          </div>
          {navItems.map((item) => {
            const active = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#1C1412] text-[#F7D878] shadow-md border border-[#E5A93C]/40'
                    : 'text-[#1C1412]/80 hover:bg-white/80 hover:text-[#1C1412] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#E5A93C]' : 'text-[#1C1412]/60'}`} />
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-600 text-white font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          <div className="pt-6 mt-6 border-t border-[#EADFCF]">
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#EADFCF] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1C1412]">
                <ShieldCheck className="w-4 h-4 text-[#9B6B15]" />
                <span>Security Notice</span>
              </div>
              <p className="text-[11px] text-[#1C1412]/70 leading-relaxed">
                Protected admin console. Identity documents are served securely and are not cached publicly.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
