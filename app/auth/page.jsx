'use client'
import { useState } from 'react'
import { supabase } from '../supabase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else setMessage('تم تسجيل الدخول بنجاح')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('تم إنشاء الحساب، تحقق من بريدك الإلكتروني')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </h1>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleAuth}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-bold"
        >
          {isLogin ? 'دخول' : 'إنشاء حساب'}
        </button>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-gray-400 text-center mt-4 cursor-pointer hover:text-white"
        >
          {isLogin ? 'ما عندك حساب؟ سجّل الآن' : 'عندك حساب؟ سجّل دخول'}
        </p>
        {message && <p className="text-yellow-400 text-center mt-4">{message}</p>}
      </div>
    </div>
  )
}