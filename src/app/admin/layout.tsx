import Link from 'next/link'
import {
  LayoutDashboard,
  Film,
  Tag,
  BarChart2,
  ArrowLeft,
  ShieldAlert,
  Bot,
  LogOut,
} from 'lucide-react'
import { getAdminIdentity } from '@/lib/admin-auth'
import AdminLoginPage from './login/page'

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/generator', label: 'AI Trend Studio', icon: Bot },
  { href: '/admin/series', label: 'Series & Movies', icon: Film },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const identity = await getAdminIdentity()

  // If not authorized as an admin email or via passcode, show login screen
  if (!identity) {
    return <AdminLoginPage />
  }
  const adminEmail = identity === 'passcode' ? '' : identity

  return (
    <div className="flex min-h-screen bg-gray-950 text-white selection:bg-yellow-400 selection:text-black">
      {/* Sticky Sidebar */}
      <aside className="w-64 bg-gray-900/95 border-r border-gray-800 flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-yellow-400 font-black text-xl tracking-tight">SnackDrama</p>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
              Studio Admin
            </p>
            {adminEmail && (
              <p className="text-[10px] text-green-400 font-mono mt-1 truncate max-w-[170px]">
                ● {adminEmail}
              </p>
            )}
          </div>
          <span className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
            <ShieldAlert className="w-4 h-4" />
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/80 transition-all text-sm font-medium group"
            >
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 transition-colors" />
              <span>{label}</span>
              {label === 'AI Trend Studio' && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-yellow-400 text-black font-extrabold rounded">
                  NEW
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 text-xs font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Streaming Site</span>
          </Link>

          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-gray-950 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
