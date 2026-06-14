'use client'
import { useState } from 'react'
import { supabase } from '../supabase'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    setMessage(''); setError('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (error) setError(error.message)
      else window.location.href = '/'
    } else {
      if (form.password !== form.confirm) return setError('كلمة المرور غير متطابقة')
      if (!form.username) return setError('أدخل اسم المستخدم')
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { username: form.username },
          emailRedirectTo: 'https://stately-snickerdoodle-ba1afa.netlify.app/'
        }
      })
      if (error) setError(error.message)
      else setMessage('تم إرسال رابط التأكيد لبريدك الإلكتروني')
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10"
        style={{backgroundImage: 'linear-gradient(#00c896 1px, transparent 1px), linear-gradient(90deg, #00c896 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00c896] opacity-5 rounded-full blur-3xl" />

      {/* Floating Icons */}
      <div className="absolute top-10 left-10 text-[#00c896] opacity-20 text-4xl animate-pulse">🔒</div>
      <div className="absolute top-20 right-16 text-[#00c896] opacity-20 text-2xl animate-bounce">🛡️</div>
      <div className="absolute bottom-20 left-20 text-[#00c896] opacity-20 text-3xl animate-pulse">⚡</div>
      <div className="absolute bottom-10 right-10 text-[#00c896] opacity-20 text-4xl animate-bounce">🔐</div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white">LVL <span className="text-[#00c896]">UP</span></h1>
          <p className="text-gray-500 text-sm mt-1">منصة الأمن السيبراني العربية</p>
        </div>

        <div className="bg-[#161b22] border border-[#00c896]/20 rounded-2xl p-8 shadow-2xl shadow-[#00c896]/5">
          {/* Tabs */}
          <div className="flex mb-6 bg-[#0d1117] rounded-xl p-1">
            <button onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-[#00c896] text-black' : 'text-gray-500 hover:text-white'}`}>
              تسجيل الدخول
            </button>
            <button onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-[#00c896] text-black' : 'text-gray-500 hover:text-white'}`}>
              إنشاء حساب
            </button>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <input name="username" placeholder="اسم المستخدم" onChange={handle}
                className="w-full bg-[#0d1117] border border-gray-800 focus:border-[#00c896] text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600" />
            )}
            <input name="email" type="email" placeholder="البريد الإلكتروني" onChange={handle}
              className="w-full bg-[#0d1117] border border-gray-800 focus:border-[#00c896] text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600" />
            <input name="password" type="password" placeholder="كلمة المرور" onChange={handle}
              className="w-full bg-[#0d1117] border border-gray-800 focus:border-[#00c896] text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600" />
            {!isLogin && (
              <input name="confirm" type="password" placeholder="تأكيد كلمة المرور" onChange={handle}
                className="w-full bg-[#0d1117] border border-gray-800 focus:border-[#00c896] text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600" />
            )}
          </div>

          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
          {message && <p className="text-[#00c896] text-sm mt-4 text-center">{message}</p>}

          <button onClick={submit}
            className="w-full mt-6 bg-[#00c896] hover:bg-[#00b085] text-black font-black py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            {isLogin ? 'دخول' : 'إنشاء حساب'}
          </button>
        </div>
      </div>
    </div>
  )
}