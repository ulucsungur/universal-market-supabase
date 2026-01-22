import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 5 saniye zaman aşımı ekleyelim ki API yavaşsa uygulama donmasın
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch('https://www.frankfurter.app/latest?from=TRY&to=USD,EUR', {
      signal: controller.signal,
      next: { revalidate: 3600 },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Frankfurter API Hatası: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Kur API sunucu hatası:', error)

    // HATA DURUMUNDA FALLBACK: API çalışmazsa sabit kurları dön (Sitenin çökmesini engeller)
    return NextResponse.json({
      base: 'TRY',
      rates: {
        USD: 0.033, // Tahmini sabit kurlar (Uygulama çalışmaya devam eder)
        EUR: 0.031,
      },
    })
  }
}
