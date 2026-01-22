'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { ArrowRight, ImageOff } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useCurrency } from '@/providers/Currency';

export const PickedForYou = () => {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { convert } = useCurrency();

  // useEffect(() => {
  //   // depth=1 ekleyerek resim objesinin (url dahil) gelmesini garanti ediyoruz
  //   fetch(`/api/listings?locale=${locale}&limit=5&sort=-createdAt&depth=1`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setListings(data.docs || [])
  //       setLoading(false)
  //     })
  //     .catch((err) => {
  //       console.error('İlanlar çekilirken hata:', err)
  //       setLoading(false)
  //     })
  // }, [locale])

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-200 dark:border-white/10 pb-8 mb-12 gap-4">
        <div className="space-y-2">
          <span className="text-purple-600 font-black text-[10px] tracking-[0.4em] uppercase">
            Marketplace
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
            {t('pickedForYou')}
          </h2>
        </div>
        <Link
          href="/vehicle"
          className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          {t('seeAll')} <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {loading
          ? [1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-white/5"
              />
            ))
          : listings.map((item) => {
              // Resim URL kontrolü
              const imageUrl = item.mainImage?.url;

              return (
                <Link
                  key={item.id}
                  href={`/listing/${item.id}`}
                  className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800 mb-4">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.title || 'İlan'}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 20vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <ImageOff size={24} className="mb-2 opacity-20" />
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20 italic">
                          Görsel Yok
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-black uppercase truncate text-slate-800 dark:text-slate-200 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-purple-600 dark:text-purple-400 font-black text-sm">
                      {convert(item.price, item.currency || 'TRY')}
                    </p>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
};
