'use client'
import React, { useState } from 'react'
import Image from 'next/image'

export const ListingGallery = ({ images, title }: { images: string[]; title: string }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="space-y-6">
      {/* ANA BÜYÜK RESİM */}
      <div className="relative aspect-[16/10] w-full rounded-[3.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-2xl">
        {images.length > 0 ? (
          <Image
            src={images[activeIndex]}
            alt={title}
            fill
            className="object-contain p-4"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-black uppercase">
            Resim Yok
          </div>
        )}
        <div className="absolute bottom-8 right-8 px-5 py-2 bg-black/60 backdrop-blur-xl rounded-2xl text-white text-[10px] font-black tracking-widest">
          {activeIndex + 1} / {images.length} FOTOĞRAF
        </div>
      </div>

      {/* KÜÇÜK RESİMLER (Thumbnails) */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-32 h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden border-4 transition-all ${
                activeIndex === i
                  ? 'border-purple-600 scale-105 shadow-lg'
                  : 'border-white dark:border-slate-800 opacity-40 hover:opacity-100'
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
