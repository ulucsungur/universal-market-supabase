'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const HeroSlider = () => {
  const t = useTranslations('HomePage')
  const [currentIndex, setCurrentIndex] = useState(0)

  const slides = [
    {
      id: 1,
      type: 'mor',
      title: t('heroTitle') + ' MARKET',
      subtitle: 'PREMIUM EXPERIENCE',
      desc: t('heroDescription'),
      btn: t('browseListings'),
      link: '/vehicle',
      image: '/media/bmw218coupe.jpg',
    },
    {
      id: 2,
      type: 'promo',
      title: t('promoTitle'),
      subtitle: 'LIMITED TIME',
      desc: t('promoDesc'),
      btn: t('discoverMore'),
      link: '/property',
      image: '/media/kusbakisievler.jpg',
    },
    {
      id: 3,
      type: 'mor',
      title: 'BMW 5 SERİSİ',
      subtitle: 'ÖZEL TEKLİF',
      desc: 'Performans ve konforun buluştuğu noktada yeni nesil sürüş deneyimi.',
      btn: 'İncele',
      link: '/vehicle/cars/bmw',
      image: '/media/BMW520.jpg',
    },
    {
      id: 4,
      type: 'promo',
      title: 'LUXURY REAL ESTATE',
      subtitle: 'MODERN YAŞAM',
      desc: 'Şehrin kalbinde, hayalinizdeki modern ve lüks daireler sizi bekliyor.',
      btn: 'Portföyü Gör',
      link: '/property',
      image: '/media/East_Atasehir_20180613.jpg',
    },
  ]

  const nextSlide = () => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))

  return (
    <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden group bg-slate-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/40 to-transparent z-10" />
          </div>

          <div className="relative h-full max-w-[1400px] mx-auto px-8 md:px-12 flex flex-col justify-center items-start text-white space-y-6 z-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/20 backdrop-blur-md border border-white/20 text-[9px] font-black tracking-[0.3em] uppercase text-white">
              <Sparkles size={12} className="text-yellow-400" />
              {slide.subtitle}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase drop-shadow-2xl">
              {slide.title}
            </h1>
            <p className="max-w-xl text-lg text-slate-100 font-medium leading-relaxed opacity-90 drop-shadow-md">
              {slide.desc}
            </p>
            <Link
              href={slide.link}
              className="bg-white text-slate-950 px-10 py-5 rounded-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all flex items-center gap-3 shadow-2xl"
            >
              {slide.btn} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-0 top-0 bottom-0 z-30 px-4 bg-transparent hover:bg-black/20 text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-0 bottom-0 z-30 px-4 bg-transparent hover:bg-black/20 text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={48} strokeWidth={1} />
      </button>
    </section>
  )
}
