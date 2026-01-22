'use client'

import React from 'react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Home, Car, Info, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCurrency } from '@/providers/Currency'

export const ListingCard = ({ listing }: { listing: any }) => {
  const { convert } = useCurrency()
  const t = useTranslations('CategoryPage')
  const isRealEstate = listing.vehicleType === 'real-estate'
  const isCar = listing.vehicleType === 'cars'
  const isMotor = listing.vehicleType === 'motorcycle'

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
      {/* Resim Alanı */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
        {listing.mainImage?.url ? (
          <Image
            src={listing.mainImage.url}
            alt={listing.title || 'İlan'}
            fill
            unoptimized
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-[10px] font-black uppercase italic tracking-widest">
            {t('noImage')}
          </div>
        )}

        {/* Fiyat Etiketi */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl z-20 border border-white/20">
          <span className="text-purple-600 dark:text-purple-400 font-black text-xs uppercase tracking-tighter">
            {convert(listing.price, listing.currency || 'TRY')}
          </span>
        </div>

        {/* Kategori Rozeti */}
        <div className="absolute top-4 left-4 bg-slate-900/80 dark:bg-purple-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest z-20">
          {listing.listingType === 'for-sale' ? t('forSale') : t('forRent')}
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase mb-3 tracking-[0.2em]">
          {isRealEstate && <Home size={12} />}
          {isCar && <Car size={12} />}
          {isMotor && <Info size={12} />}
          <span>
            {isRealEstate ? 'Emlak' : isCar ? 'Otomobil' : isMotor ? 'Motosiklet' : 'İlan'}
          </span>
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter line-clamp-1 mb-6 group-hover:text-purple-600 transition-colors">
          {listing.title}
        </h3>

        {/* Alt Bilgi & Link */}
        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
          <Link
            href={`/listing/${listing.id}`}
            className="flex items-center justify-center w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white shadow-lg active:scale-95"
          >
            {t('seeDetails')}
          </Link>
        </div>
      </div>
    </div>
  )
}
