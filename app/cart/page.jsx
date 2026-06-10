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
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl mb-4">سجّل دخول عشان تشوف سلتك</p>
        <Link href="/auth" className="bg-purple-600 px-6 py-2 rounded-lg">دخول</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-400">LVL UP</Link>
        <Link href="/courses" className="hover:text-purple-400">الدورات</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">سلتي</h1>
        {orders.length === 0 ? (
          <p className="text-gray-400">السلة فاضية</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-gray-800 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{order.courses?.title}</h2>
                  <p className="text-purple-400">
                    {order.courses?.is_free ? 'مجاني' : `${order.courses?.price} ريال`}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(order.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}