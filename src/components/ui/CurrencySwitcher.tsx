'use client'

import { useCurrency } from '@/providers/Currency'
import { Banknote } from 'lucide-react'

export const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
      {(['TRY', 'USD', 'EUR'] as const).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
            currency === c
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          {c === 'TRY' ? '₺' : c === 'USD' ? '$' : '€'}
        </button>
      ))}
    </div>
  )
}
