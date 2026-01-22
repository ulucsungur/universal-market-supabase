'use client'

import React, { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpDown, Filter, X } from 'lucide-react'

export const CategoryFilters = () => {
  const t = useTranslations('Filters')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State: Input içindeki değerleri tutar (Henüz 'Uygula'ya basılmadan önceki hali)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  // URL'yi güncelleyen fonksiyon
  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClear = () => {
    setMinPrice('')
    setMaxPrice('')
    router.push(pathname)
  }

  return (
    <div className="space-y-8 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
      {/* 1. SIRALAMA */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] flex items-center gap-2">
          <ArrowUpDown size={14} /> {t('sortBy')}
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { id: '-createdAt', label: t('newest') },
            { id: 'price', label: t('priceAsc') },
            { id: '-price', label: t('priceDesc') },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateFilters({ sort: opt.id })}
              className={`text-left text-xs font-bold py-2.5 px-4 rounded-xl transition-all ${
                searchParams.get('sort') === opt.id ||
                (!searchParams.get('sort') && opt.id === '-createdAt')
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-500 hover:bg-white dark:hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. FİYAT FİLTRESİ */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] flex items-center gap-2">
          <Filter size={14} /> {t('title')}
        </h3>
        <div className="space-y-3">
          <input
            type="number"
            placeholder={t('minPrice')}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-purple-500 transition-all"
          />
          <input
            type="number"
            placeholder={t('maxPrice')}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-purple-500 transition-all"
          />
          <div className="flex gap-2">
            <button
              onClick={() => updateFilters({ minPrice, maxPrice })}
              className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase py-3.5 rounded-xl hover:opacity-90 transition-all"
            >
              {t('apply')}
            </button>
            <button
              onClick={handleClear}
              className="p-3 bg-slate-200 dark:bg-white/10 rounded-xl hover:text-red-500 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
