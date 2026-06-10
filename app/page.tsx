'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-400">LVL UP</h1>
        <div className="flex gap-4">
          <Link href="/courses" className="hover:text-purple-400">الدورات</Link>
          {user ? (
            <>
              <Link href="/cart" className="hover:text-purple-400">السلة</Link>
              <button onClick={handleLogout} className="hover:text-red-400">خروج</button>
            </>
          ) : (
            <Link href="/auth" className="bg-purple-600 px-4 py-1 rounded-lg hover:bg-purple-700">دخول</Link>
          )}
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center text-center py-24 px-4">
        <h2 className="text-5xl font-bold mb-6">ارفع مستواك في <span className="text-purple-400">الأمن السيبراني</span></h2>
        <p className="text-gray-400 text-xl mb-8">دورات احترافية باللغة العربية للمبتدئين والمحترفين</p>
        <Link href="/courses" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl text-lg font-bold">
          تصفح الدورات
        </Link>
      </div>
    </div>
  )
}