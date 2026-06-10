'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function AdminPage() {
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)

  const ADMIN_EMAIL = 'zzaiin07@gmail.com'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user?.email === ADMIN_EMAIL) {
        supabase
          .from('orders')
          .select('*, courses(*)')
          .order('created_at', { ascending: false })
          .then(({ data: ordersData }) => setOrders(ordersData || []))
      }
    })
  }, [])

  if (!user || user.email !== ADMIN_EMAIL) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p className="text-xl text-red-400">غير مصرح لك بالدخول</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 px-8 py-4">
        <h1 className="text-2xl font-bold text-purple-400">لوحة الأدمن — LVL UP</h1>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">الطلبات ({orders.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-xl">
            <thead>
              <tr className="text-purple-400 text-right border-b border-gray-700">
                <th className="p-4">المستخدم</th>
                <th className="p-4">الدورة</th>
                <th className="p-4">السعر</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-4 text-sm text-gray-400">{order.user_id?.slice(0, 8)}...</td>
                  <td className="p-4">{order.courses?.title}</td>
                  <td className="p-4 text-purple-400">
                    {order.courses?.is_free ? 'مجاني' : `${order.courses?.price} ريال`}
                  </td>
                  <td className="p-4">
                    <span className="bg-yellow-600 px-2 py-1 rounded text-sm">{order.status}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}