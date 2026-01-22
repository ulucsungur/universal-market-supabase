'use client'
import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ArrowRight, ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const CategoryCard = ({
  title,
  slug,
  image,
}: {
  title: string
  slug: string
  image?: any
}) => {
  const t = useTranslations('HomePage')

  // Payload'dan gelen resim objesini veya string linki alıyoruz
  const imageUrl = typeof image === 'object' ? image?.url : image

  return (
    <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-white/5 flex flex-col h-full shadow-sm hover:shadow-md transition-all group">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight uppercase">
        {title}
      </h3>

      <div className="relative flex-1 min-h-[220px] bg-slate-50 dark:bg-slate-800/40 overflow-hidden mb-4 border border-slate-100 dark:border-white/5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || 'Category'}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-700">
            <ImageIcon size={48} strokeWidth={1} className="mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase opacity-20 italic">Görsel Yok</span>
          </div>
        )}
      </div>

      <Link
        href={`/${slug}`}
        className="text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest hover:underline flex items-center gap-2 group mt-auto"
      >
        {t('discoverMore')}
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}
