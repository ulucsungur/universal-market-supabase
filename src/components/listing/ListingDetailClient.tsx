'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useCurrency } from '@/providers/Currency';
import { Heart, Share2, Tag, Calendar, User } from 'lucide-react';

interface ListingDetailClientProps {
  listing: any;
  isInitialBookmarked: boolean;
}

export const ListingDetailClient = ({
  listing,
  isInitialBookmarked,
}: ListingDetailClientProps) => {
  const locale = useLocale();
  const t = useTranslations('ListingDetail');
  const { convert } = useCurrency();

  // Kategori ismini dile göre belirle
  const categoryTitle =
    locale === 'en'
      ? listing.categories?.title_en || listing.categories?.title
      : listing.categories?.title;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-20">
      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        {/* Üst Kısım: Başlık ve Aksiyonlar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-widest">
              <Tag size={14} />
              {categoryTitle || 'Kategori Yok'}
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
              {listing.title}
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl hover:text-red-500 transition-colors shadow-sm">
              <Heart
                size={20}
                fill={isInitialBookmarked ? 'currentColor' : 'none'}
              />
            </button>
            <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl hover:text-blue-500 transition-colors shadow-sm">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* SOL KOLON: Görseller ve Açıklama */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner">
              <Image
                src={listing.image_url}
                alt={listing.title || 'Listing Image'}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw" // Konsoldaki hatayı bu satır çözer
                className="object-cover"
              />
            </div>

            {/* Açıklama Kutusu */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5">
              <h3 className="text-xl font-black uppercase mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                {t('addDescription')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          </div>

          {/* SAĞ KOLON: Fiyat ve Detaylar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Fiyat Kartı */}
            <div className="bg-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-500/20">
              <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-2">
                {t('price')}
              </p>
              <div className="text-4xl font-black">
                {convert(listing.price, listing.currency || 'TRY')}
              </div>
            </div>

            {/* İlan Detay Bilgileri */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 space-y-6 shadow-sm">
              <div className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-white/5">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <Calendar size={16} /> {t('addDate')}
                </span>
                <span className="font-bold text-sm">
                  {listing.created_at
                    ? new Date(listing.created_at).toLocaleDateString(locale)
                    : '-'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-white/5">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                  <User size={16} /> {t('addOwner')}
                </span>
                <span className="font-bold text-sm">
                  {t('StoreIndividual')}
                </span>
              </div>

              <button className="w-full bg-slate-900 dark:bg-white dark:text-black text-white font-black py-5 rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 mt-4 shadow-lg">
                {t('contactToSeller')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
