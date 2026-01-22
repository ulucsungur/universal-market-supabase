'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Globe } from 'lucide-react'

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const nextLocale = locale === 'tr' ? 'en' : 'tr'
    // Mevcut sayfayı koruyarak dili değiştirir
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-purple-600 hover:text-white transition-all duration-300 group border border-slate-200 dark:border-white/10"
    >
      <Globe size={16} className="text-slate-500 group-hover:text-white transition-colors" />
      <span className="text-[10px] font-black uppercase tracking-widest leading-none">
        {locale === 'tr' ? 'EN' : 'TR'}
      </span>
    </button>
  )
}
