'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'

export default function CartPage() {
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase
          .from('orders')
          .select('*, courses(*)')
          .eq('user_id', data.user.id)
          .then(({ data: ordersData }) => setOrders(ordersData || []))
      }
    })
  }, [])

  const removeFromCart = async (orderId) => {
    await supabase.from('orders').delete().eq('id', orderId)
    setOrders(orders.filter(o => o.id !== orderId))
  }

  if (!user) return (
    <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl mb-4 text-gray-400">سجّل دخول عشان تشوف سلتك</p>
        <Link href="/auth" className="bg-[#00c896] text-black px-6 py-2 rounded-lg font-bold">دخول</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-black mb-2">سلتي 🛒</h1>
        <p className="text-gray-500 mb-8">{orders.length} دورة في السلة</p>

        {orders.length === 0 ? (
          <div className="text-center py-20 border border-gray-800 rounded-2xl">
            <p className="text-gray-500 text-lg mb-4">السلة فاضية</p>
            <Link href="/courses" className="bg-[#00c896] text-black px-6 py-2 rounded-lg font-bold">تصفح الدورات</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-[#161b22] border border-gray-800 hover:border-[#00c896]/30 rounded-2xl p-6 flex justify-between items-center transition-all">
                <div>
                  <h2 className="text-lg font-bold mb-1">{order.courses?.title}</h2>
                  <p className="text-[#00c896] font-black">
                    {order.courses?.is_free ? 'مجاني' : `${order.courses?.price} ريال`}
                  </p>
                </div>
                <button onClick={() => removeFromCart(order.id)}
                  className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                  حذف 🗑️
                </button>
              </div>
            ))}

            <div className="border-t border-gray-800 pt-6 flex justify-between items-center">
              <p className="text-gray-400">الإجمالي:</p>
              <p className="text-2xl font-black text-[#00c896]">
                {orders.reduce((sum, o) => sum + (o.courses?.is_free ? 0 : o.courses?.price || 0), 0)} ريال
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}