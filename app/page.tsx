'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [text, setText] = useState('')
  const fullText = 'ارفع مستواك في الأمن السيبراني'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    let i = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, i))
      i++
      if (i > fullText.length) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white relative overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{backgroundImage: 'linear-gradient(#00c896 1px, transparent 1px), linear-gradient(90deg, #00c896 1px, transparent 1px)', backgroundSize: '50px 50px'}} />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00c896] opacity-[0.06] rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-5 border-b border-[#00c896]/10 backdrop-blur-sm">
        <h1 className="text-2xl font-black">LVL <span className="text-[#00c896]">UP</span></h1>
        <div className="flex gap-6 items-center">
          <Link href="/courses" className="text-gray-400 hover:text-[#00c896] transition-colors text-sm">الدورات</Link>
          {user ? (
            <>
              <Link href="/cart" className="text-gray-400 hover:text-[#00c896] transition-colors text-sm">السلة</Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors text-sm">خروج</button>
            </>
          ) : (
            <Link href="/auth" className="bg-[#00c896] text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#00b085] transition-all hover:scale-105">
              دخول
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[85vh] px-4">
        {/* Badge */}
        <div className="flex items-center gap-2 bg-[#00c896]/10 border border-[#00c896]/20 text-[#00c896] text-xs px-4 py-2 rounded-full mb-8 animate-pulse">
          <span className="w-2 h-2 bg-[#00c896] rounded-full"></span>
          منصة الأمن السيبراني #1
        </div>

        {/* Typing */}
        <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
          {text}<span className="text-[#00c896] animate-pulse">|</span>
        </h2>

        <p className="text-gray-500 text-lg mb-10 max-w-xl">
          دورات احترافية باللغة العربية من الصفر للاحتراف
        </p>

        <div className="flex gap-4">
          <Link href="/courses"
            className="bg-[#00c896] text-black px-8 py-3 rounded-xl font-black hover:bg-[#00b085] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00c896]/20">
            تصفح الدورات
          </Link>
          {!user && (
            <Link href="/auth"
              className="border border-[#00c896]/30 text-[#00c896] px-8 py-3 rounded-xl font-bold hover:bg-[#00c896]/10 transition-all">
              إنشاء حساب
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-12 mt-20 text-center">
          {[['50K+', 'مستخدم'], ['100+', 'دورة'], ['4.9★', 'تقييم']].map(([num, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-[#00c896]">{num}</p>
              <p className="text-gray-600 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}