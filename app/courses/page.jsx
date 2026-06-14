'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const courseImages = {
  'أساسيات الأمن السيبراني': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
  'اختبار الاختراق': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80',
  'الـ Blue Team': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    supabase.from('courses').select('*').then(({ data }) => setCourses(data || []))
  }, [])

  const addToCart = async (courseId) => {
    if (!user) return alert('سجّل دخول أولاً')
    const { error } = await supabase.from('orders').insert({ user_id: user.id, course_id: courseId, status: 'pending' })
    if (error) alert('حدث خطأ')
    else alert('تمت الإضافة للسلة ✓')
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{backgroundImage: 'linear-gradient(#00c896 1px, transparent 1px), linear-gradient(90deg, #00c896 1px, transparent 1px)', backgroundSize: '50px 50px'}} />

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">الدورات المتاحة</h1>
          <p className="text-gray-500">احترف الأمن السيبراني مع أفضل المدربين العرب</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-[#161b22] border border-gray-800 hover:border-[#00c896]/40 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00c896]/5 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={courseImages[course.title] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${course.is_free ? 'bg-[#00c896] text-black' : 'bg-gray-800 text-[#00c896] border border-[#00c896]/30'}`}>
                    {course.is_free ? 'مجاني' : 'مدفوع'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold mb-2">{course.title}</h2>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{course.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[#00c896] font-black text-lg">
                    {course.is_free ? 'مجاني' : `${course.price} ريال`}
                  </p>
                  <button onClick={() => addToCart(course.id)}
                    className="bg-[#00c896]/10 hover:bg-[#00c896] text-[#00c896] hover:text-black border border-[#00c896]/30 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                    أضف للسلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}