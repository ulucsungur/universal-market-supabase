'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Currency = 'TRY' | 'USD' | 'EUR'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (c: Currency) => void
  rates: Record<string, number>
  convert: (amount: number, from: string) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('TRY')
  const [rates, setRates] = useState<Record<string, number>>({ TRY: 1, USD: 1, EUR: 1 })

  useEffect(() => {
    fetch('/api/currency')
      .then((res) => res.json())
      .then((data) => {
        // Gelen veride 'rates' olduğundan emin olalım
        if (data && data.rates) {
          setRates({
            TRY: 1,
            USD: data.rates.USD,
            EUR: data.rates.EUR,
          })
        }
      })
      .catch((err) => console.error('Frontend Kur Hatası:', err))
  }, [])

  // Çeviri Fonksiyonu
  const convert = (amount: number, from: string) => {
    if (!amount || !rates.USD || !rates.EUR) return '0'

    let amountInTry = amount
    if (from === 'USD') amountInTry = amount / rates.USD
    if (from === 'EUR') amountInTry = amount / rates.EUR

    // 2. Seçili kura çevir
    const finalAmount = amountInTry * rates[currency]

    const symbols = { TRY: '₺', USD: '$', EUR: '€' }
    return `${finalAmount.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${symbols[currency]}`
  }
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider')
  return context
}
