'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '../supabase'
import { useEffect, useState } from 'react'

const ADMIN_EMAIL = 'zzaiin07@gmail.com'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className="relative z-10 flex justify-between items-center px-8 py-4 border-b border-[#00c896]/10 backdrop-blur-sm bg-[#0d1117]/80 sticky top-0">
      <Link href="/" className="text-xl font-black">
        LVL <span className="text-[#00c896]">UP</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/" className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${pathname === '/' ? 'bg-[#00c896]/10 text-[#00c896]' : 'text-gray-500 hover:text-white'}`}>
          🏠 الرئيسية
        </Link>
        <Link href="/courses" className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${pathname === '/courses' ? 'bg-[#00c896]/10 text-[#00c896]' : 'text-gray-500 hover:text-white'}`}>
          📚 الدورات
        </Link>
        {user && (
          <Link href="/cart" className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${pathname === '/cart' ? 'bg-[#00c896]/10 text-[#00c896]' : 'text-gray-500 hover:text-white'}`}>
            🛒 السلة
          </Link>
        )}
        {user?.email === ADMIN_EMAIL && (
          <Link href="/admin" className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${pathname === '/admin' ? 'bg-[#00c896]/10 text-[#00c896]' : 'text-gray-500 hover:text-white'}`}>
            📋 طلبات العملاء
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-xs text-gray-600 hidden md:block">{user.email}</span>
            <button onClick={logout}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-400/10">
              خروج 🚪
            </button>
          </>
        ) : (
          <Link href="/auth"
            className="bg-[#00c896] text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#00b085] transition-all">
            دخول
          </Link>
        )}
      </div>
    </nav>
  )
}