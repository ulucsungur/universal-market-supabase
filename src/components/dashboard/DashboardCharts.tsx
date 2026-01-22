'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslations } from 'next-intl'

// Şimdilik simülasyon verisi (İleride bunu veritabanından alabiliriz)
const data = [
  { name: 'Pzt', views: 400 },
  { name: 'Sal', views: 700 },
  { name: 'Çar', views: 500 },
  { name: 'Per', views: 1200 },
  { name: 'Cum', views: 900 },
  { name: 'Cmt', views: 1500 },
  { name: 'Paz', views: 1100 },
]

export const DashboardCharts = () => {
  const t = useTranslations('Dashboard')

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-sm h-full min-h-[400px]">
      <div className="mb-10 space-y-1">
        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
          {t('performance')}
        </h3>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
          {t('performanceDesc')}
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }}
              dy={10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '15px',
                border: 'none',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                backgroundColor: '#1e1b4b',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#9333ea"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
