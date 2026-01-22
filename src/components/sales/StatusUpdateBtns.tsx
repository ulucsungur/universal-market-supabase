'use client'

import React, { useState } from 'react'
import { updateOrderStatusAction } from '@/lib/actions/order'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export const StatusUpdateBtns = ({
  orderId,
  currentStatus,
  orderType,
}: {
  orderId: number
  currentStatus: string
  orderType: string
}) => {
  const t = useTranslations('Status')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (status: OrderStatus) => {
    setLoading(true)
    const res = await updateOrderStatusAction(orderId, status)
    if (!res.success) alert(res.error)
    setLoading(false)
  }

  if (currentStatus === 'delivered' || currentStatus === 'cancelled') return null
  // Kiralama mı yoksa normal satış mı kontrolü
  const isRental = orderType === 'rental'

  return (
    <div className="flex gap-2 mt-4">
      {currentStatus === 'paid' && (
        <button
          onClick={() => handleUpdate('shipped')}
          disabled={loading}
          className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : isRental ? (
            'KİRALAMAYI BAŞLAT'
          ) : (
            t('markAsShipped')
          )}
        </button>
      )}

      {currentStatus === 'shipped' && (
        <button
          onClick={() => handleUpdate('delivered')}
          disabled={loading}
          className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : isRental ? (
            'KİRALAMAYI TAMAMLA'
          ) : (
            t('markAsDelivered')
          )}
        </button>
      )}
    </div>
  )
}
