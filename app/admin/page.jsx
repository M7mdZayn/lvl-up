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
          .select('*, courses(*), profiles(username, email)')
          .order('created_at', { ascending: false })
          .then(({ data: ordersData }) => setOrders(ordersData || []))
      }
    })
  }, [])

  if (!user || user.email !== ADMIN_EMAIL) return (
    <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
      <p className="text-red-400 text-xl">غير مصرح لك بالدخول</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-black mb-2">لوحة الأدمن</h2>
        <p className="text-gray-500 mb-8">إجمالي الطلبات: {orders.length}</p>

        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full bg-[#161b22]">
            <thead>
              <tr className="text-[#00c896] text-sm border-b border-gray-800">
                <th className="p-4 text-right">المستخدم</th>
                <th className="p-4 text-right">الإيميل</th>
                <th className="p-4 text-right">الدورة</th>
                <th className="p-4 text-right">السعر</th>
                <th className="p-4 text-right">الحالة</th>
                <th className="p-4 text-right">التاريخ</th>
                <th className="p-4 text-right">الساعة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const date = new Date(order.created_at)
                return (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-[#1c2128] transition-colors">
                    <td className="p-4 font-bold text-white">{order.profiles?.username || '—'}</td>
                    <td className="p-4 text-gray-400 text-sm">{order.profiles?.email || '—'}</td>
                    <td className="p-4">{order.courses?.title}</td>
                    <td className="p-4 text-[#00c896] font-bold">
                      {order.courses?.is_free ? 'مجاني' : `${order.courses?.price} ريال`}
                    </td>
                    <td className="p-4">
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {date.toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}