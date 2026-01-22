'use client'

import React from 'react'
import { LayoutGrid, BadgeDollarSign, MessageSquare, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const DashboardStats = ({ stats }: { stats: any }) => {
  const t = useTranslations('Dashboard.stats')

  const items = [
    {
      label: t('activeListings'),
      value: stats.listingsCount,
      icon: LayoutGrid,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      hasBadge: false,
    },
    {
      label: t('totalSales'),
      value: stats.salesCount,
      icon: BadgeDollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      hasBadge: stats.salesCount > 0,
    },
    {
      label: t('unreadMessages'),
      value: stats.messagesCount,
      icon: MessageSquare,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      hasBadge: stats.messagesCount > 0,
    },
    {
      label: 'Platform Puanı',
      value: '9.8',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group"
        >
          {item.hasBadge && (
            <div className="absolute top-6 right-6 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600"></span>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div
              className={`${item.bg} ${item.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}
            >
              <item.icon size={24} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {item.label}
            </p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {item.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  )
}
