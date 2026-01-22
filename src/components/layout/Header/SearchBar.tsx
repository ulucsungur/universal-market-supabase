'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, Link } from '@/i18n/routing'
import { Search, Loader2, ImageOff } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { useCurrency } from '@/providers/Currency'

export const SearchBar = () => {
  const t = useTranslations('Navbar')
  const locale = useLocale()
  const router = useRouter()

  const { convert } = useCurrency()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Dışarı tıklandığında kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Arama Mantığı (Debounce: 300ms)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true)
        setShowDropdown(true)
        try {
          // Payload API üzerinden başlıkta arama yapıyoruz
          const res = await fetch(
            `/api/listings?locale=${locale}&where[title][contains]=${query}&limit=5&depth=1`,
          )
          const data = await res.json()
          setResults(data.docs || [])
        } catch (error) {
          console.error('Arama hatası:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, locale])

  return (
    <div className="flex-1 max-w-2xl relative group" ref={dropdownRef}>
      {/* INPUT ALANI */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setShowDropdown(true)}
          placeholder={t('searchPlaceholder')}
          className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-purple-500 rounded-2xl py-3 px-6 pr-12 text-sm outline-none transition-all dark:text-white"
        />
        <div className="absolute right-3 flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </div>

      {/* SONUÇ LİSTESİ (DROPDOWN) */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={`/listing/${item.id}`}
                  onClick={() => {
                    setShowDropdown(false)
                    setQuery('')
                  }}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all border-b border-slate-100 dark:border-white/5 last:border-0"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    {item.mainImage?.url ? (
                      <Image src={item.mainImage.url} alt="" fill className="object-cover" />
                    ) : (
                      <ImageOff className="w-full h-full p-3 opacity-20" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-purple-600 font-black">
                      {convert(item.price, item.currency || 'TRY')}
                    </p>
                  </div>
                </Link>
              ))}
              <button
                onClick={() => router.push(`/vehicle?search=${query}`)}
                className="p-3 text-[10px] font-black uppercase text-center text-slate-400 hover:text-purple-600 bg-slate-50/50 dark:bg-black/20 transition-all"
              >
                Tüm Sonuçları Gör
              </button>
            </div>
          ) : (
            !isLoading && (
              <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                {t('noResults')}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
