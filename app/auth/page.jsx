'use client'
import { useState } from 'react'
import { supabase } from '../supabase'

const validateUsername = (u) => /^[a-zA-Z][a-zA-Z0-9_]{2,}$/.test(u)
const validatePassword = (p) => /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(p)

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({})

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setTouched({ ...touched, [e.target.name]: true })
  }

  const hints = {
    username: touched.username && form.username && !validateUsername(form.username)
      ? '⚠️ يجب أن يبدأ بحرف إنجليزي ولا يحتوي على رموز (3 خانات على الأقل)'
      : touched.username && form.username && validateUsername(form.username)
      ? '✓ اسم المستخدم صحيح' : '',

    password: touched.password && form.password && !validatePassword(form.password)
      ? '⚠️ كلمة المرور يجب أن تحتوي على حروف وأرقام ولا تقل عن 8 خانات'
      : touched.password && form.password && validatePassword(form.password)
      ? '✓ كلمة المرور قوية' : '',

    confirm: touched.confirm && form.confirm && form.confirm !== form.password
      ? '⚠️ كلمتا المرور غير متطابقتين'
      : touched.confirm && form.confirm && form.confirm === form.password
      ? '✓ كلمتا المرور متطابقتان' : '',
  }

  const hintColor = (hint) => hint?.startsWith('✓') ? 'text-[#00c896]' : 'text-yellow-400'

  const submit = async () => {
    setMessage(''); setError('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (error) setError(error.message)
      else window.location.href = '/'
    } else {
      if (!form.username) return setError('أدخل اسم المستخدم')
      if (!validateUsername(form.username)) return setError('اسم المستخدم يجب أن يبدأ بحرف إنجليزي ولا يحتوي على رموز')
      if (!validatePassword(form.password)) return setError('كلمة المرور ضعيفة — يجب أن تحتوي على حروف وأرقام ولا تقل عن 8 خانات')
      if (form.password !== form.confirm) return setError('كلمتا المرور غير متطابقتين')

      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', form.username)
        .single()

      if (existing) return setError('اسم المستخدم محجوز، اختر اسماً آخر')

      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { username: form.username },
          emailRedirectTo: 'https://stately-snickerdoodle-ba1afa.netlify.app/'
        }
      })
      if (error) setError(error.message)
      else setMessage('✓ تم إرسال رابط التأكيد لبريدك الإلكتروني')
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{backgroundImage: 'linear-gradient(#00c896 1px, transparent 1px), linear-gradient(90deg, #00c896 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00c896] opacity-5 rounded-full blur-3xl" />

      <div className="absolute top-10 left-10 text-[#00c896] opacity-20 text-4xl animate-pulse">🔒</div>
      <div className="absolute top-20 right-16 text-[#00c896] opacity-20 text-2xl animate-bounce">🛡️</div>
      <div className="absolute bottom-20 left-20 text-[#00c896] opacity-20 text-3xl animate-pulse">⚡</div>
      <div className="absolute bottom-10 right-10 text-[#00c896] opacity-20 text-4xl animate-bounce">🔐</div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white">LVL <span className="text-[#00c896]">UP</span></h1>
          <p className="text-gray-500 text-sm mt-1">منصة الأمن السيبراني العربية</p>
        </div>

        <div className="bg-[#161b22] border border-[#00c896]/20 rounded-2xl p-8 shadow-2xl">
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

          <div className="space-y-3">
            {!isLogin && (
              <div>
                <input name="username" placeholder="اسم المستخدم (يبدأ بحرف إنجليزي)" onChange={handle}
                  className="w-full bg-[#0d1117] border border-gray-800 focus:border-[#00c896] text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600 text-sm" />
                {hints.username && <p className={`text-xs mt-1 px-1 ${hintColor(hints.username)}`}>{hints.username}</p>}
              </div>
            )}

            <input name="email" type="email" placeholder="البريد الإلكتروني" onChange={handle}
              className="w-full bg-[#0d1117] border border-gray-800 focus:border-[#00c896] text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600 text-sm" />

            <div>
              <input name="password" type="password" placeholder="كلمة المرور (8 خانات، حروف وأرقام)" onChange={handle}
                className="w-full bg-[#0d1117] border border-gray-800 focus:border-[#00c896] text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600 text-sm" />
              {!isLogin && hints.password && <p className={`text-xs mt-1 px-1 ${hintColor(hints.password)}`}>{hints.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <input name="confirm" type="password" placeholder="تأكيد كلمة المرور" onChange={handle}
                  className="w-full bg-[#0d1117] border border-gray-800 focus:border-[#00c896] text-white px-4 py-3 rounded-xl outline-none transition-all placeholder-gray-600 text-sm" />
                {hints.confirm && <p className={`text-xs mt-1 px-1 ${hintColor(hints.confirm)}`}>{hints.confirm}</p>}
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
          {message && <p className="text-[#00c896] text-sm mt-4 text-center">{message}</p>}

          <button onClick={submit}
            className="w-full mt-6 bg-[#00c896] hover:bg-[#00b085] text-black font-black py-3 rounded-xl transition-all hover:scale-[1.02]">
            {isLogin ? 'دخول' : 'إنشاء حساب'}
          </button>
        </div>
      </div>
    </div>
  )
}