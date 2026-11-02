'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Lock, ArrowRight, AlertCircle, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Incorrect admin passcode')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white selection:bg-yellow-400 selection:text-black">
      <div className="w-full max-w-md bg-gray-900/90 rounded-3xl p-8 border border-gray-800 shadow-2xl backdrop-blur-xl">
        {/* Shield Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center mb-4 text-yellow-400 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">ScroReel Studio</h1>
          <p className="text-gray-400 text-xs mt-1">
            Restricted Admin Area • Creator Access Only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Option: Sign in with Admin Account */}
        <div className="mb-6">
          <Link
            href="/login?returnTo=/admin"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-yellow-400/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in with sword.maataoui@gmail.com</span>
          </Link>
          <p className="text-center text-[11px] text-gray-500 mt-2">
            Signing in with your admin email unlocks the studio automatically.
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-900 px-3 text-[11px] text-gray-500 uppercase">
              Or enter master passcode
            </span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master passcode"
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 pl-10"
              />
              <Lock className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold text-xs rounded-xl transition-all border border-gray-700 disabled:opacity-40"
          >
            <span>{loading ? 'Verifying...' : 'Unlock with Passcode'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← Return to Public Streaming Site
          </Link>
        </div>
      </div>
    </div>
  )
}
