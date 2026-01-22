'use client'

import React from 'react'
import { Package, Truck, CheckCircle2, Clock, XCircle, CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const StatusBadge = ({ status, orderType }: { status: string; orderType?: string }) => {
  const t = useTranslations('Status')
  const isRental = orderType === 'rental'

  // Hangi statü anahtarını kullanacağımızı belirliyoruz
  let statusKey = status
  if (isRental && status === 'shipped') statusKey = 'shipped_rental'
  if (isRental && status === 'delivered') statusKey = 'delivered_rental'

  const statusMap: any = {
    pending: { label: t('pending'), color: 'bg-amber-100 text-amber-600', icon: Clock },
    paid: { label: t('paid'), color: 'bg-blue-100 text-blue-600', icon: Package },
    shipped: { label: t('shipped'), color: 'bg-purple-100 text-purple-600', icon: Truck },
    shipped_rental: { color: 'bg-purple-100 text-purple-600', icon: CalendarDays },
    delivered: { label: t('delivered'), color: 'bg-green-100 text-green-600', icon: CheckCircle2 },
    cancelled: { label: 'cancelled', color: 'bg-red-100 text-red-600', icon: XCircle },
  }

  const config = statusMap[statusKey] || statusMap.pending
  const Icon = config.icon

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${config.color}`}
    >
      <Icon size={12} />
      {t.has(statusKey) ? t(statusKey) : statusKey}
    </div>
  )
}
