'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.from('courses').select('*').then(({ data }) => setCourses(data || []))
  }, [])

  const addToCart = async (courseId) => {
    if (!user) return alert('سجّل دخول أولاً')
    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      course_id: courseId,
      status: 'pending'
    })
    if (error) alert('حدث خطأ')
    else alert('تمت الإضافة للسلة')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-400">LVL UP</Link>
        <div className="flex gap-4">
          {user ? (
            <Link href="/cart" className="hover:text-purple-400">السلة</Link>
          ) : (
            <Link href="/auth" className="bg-purple-600 px-4 py-1 rounded-lg">دخول</Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">الدورات المتاحة</h1>
        {courses.length === 0 ? (
          <p className="text-gray-400">لا توجد دورات حالياً</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                <p className="text-gray-400 mb-4">{course.description}</p>
                <p className="text-purple-400 font-bold mb-4">
                  {course.is_free ? 'مجاني' : `${course.price} ريال`}
                </p>
                <button
                  onClick={() => addToCart(course.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg"
                >
                  أضف للسلة
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}