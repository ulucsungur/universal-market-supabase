'use client'

import React, { useState, useMemo } from 'react' // useMemo ekledik
import { useRouter } from '@/i18n/routing'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format, differenceInDays, isBefore, startOfToday } from 'date-fns'
import 'react-day-picker/dist/style.css' // Takvim stili
import { useLocale, useTranslations } from 'next-intl'
import { useCurrency } from '@/providers/Currency'
import { ListingHeader } from '@/components/listing/ListingHeader'
import { ListingGallery } from '@/components/listing/ListingGallery'
import { ListingSpecs } from '@/components/listing/ListingSpecs'
import { ListingSellerCard } from '@/components/listing/ListingSellerCard'
import { BookmarkBtn } from '@/components/ui/BookmarkBtn'
import { useCart } from '@/providers/Cart'
import { ShoppingCart, Zap } from 'lucide-react'

export const ListingDetailClient = ({
  listing,
  isInitialBookmarked,
}: {
  listing: any
  isInitialBookmarked: boolean
}) => {
  const router = useRouter()
  const t = useTranslations('CategoryPage')
  const { convert } = useCurrency()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const locale = useLocale()

  // --- KESİN ÇÖZÜM: BAŞLIĞI NE OLURSA OLSUN PARÇALA ---
  const displayTitle = useMemo(() => {
    const raw = listing?.title
    if (!raw) return 'Başlıksız İlan'

    // Durum 1: Zaten bir obje gelmişse { tr: '...', en: '...' }
    if (typeof raw === 'object' && raw !== null) {
      return raw[locale] || raw['tr'] || raw['en'] || 'Başlıksız'
    }

    // Durum 2: Metin gelmiş ama içinde JSON gizliyse {"tr": "..."}
    if (typeof raw === 'string' && raw.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(raw)
        return parsed[locale] || parsed['tr'] || parsed['en'] || raw
      } catch (e) {
        return raw // JSON değilmiş, düz metinmiş
      }
    }

    // Durum 3: Zaten temiz bir metindir
    return raw
  }, [listing?.title, locale])

  // --- RESİMLER (ÇİFT RESİM ENGELLEYİCİ) ---
  const images = useMemo(() => {
    const mainUrl =
      typeof listing.mainImage === 'object' ? listing.mainImage?.url : listing.mainImage
    const galleryUrls =
      listing.gallery?.map((img: any) => (typeof img === 'object' ? img.url : img)) || []
    return Array.from(new Set([mainUrl, ...galleryUrls])).filter(Boolean) as string[]
  }, [listing.mainImage, listing.gallery])

  const canBuyOnline = Boolean(
    listing?.category &&
    typeof listing.category === 'object' &&
    listing.category.enableOnlineSales &&
    listing.allowOnlinePurchase,
  )

  const handleAdd = () => {
    addToCart({
      id: listing.id,
      title: displayTitle,
      price: listing.price,
      currency: listing.currency,
      image: listing.mainImage?.url,
      quantity: quantity,
      stock: listing.stock || 99,
    })
    alert('Sepete eklendi!')
  }

  // 2. Takvim için yeni state
  const [range, setRange] = useState<DateRange | undefined>()

  // 3. Fiyat Hesaplama Mantığı
  const selectedDays = range?.from && range?.to ? differenceInDays(range.to, range.from) + 1 : 0
  const totalPrice = selectedDays * (listing.price || 0)

  // 4. Kiralama Talebi Fonksiyonu mail atan versiyon
  // const handleRentalRequest = () => {
  //   if (!range?.from || !range?.to) return alert('Lütfen tarih aralığı seçin.')

  //   const sellerName = listing.author?.name || 'User'
  //   const sellerEmail = listing.author?.email
  //   if (!sellerEmail) {
  //     alert('Satıcının e-posta adresi profilinde tanımlı değil.')
  //     return
  //   }
  //   const currentUrl =
  //     typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''

  //   // Tarihleri formatla
  //   const fromStr = format(range.from, 'dd.MM.yyyy')
  //   const toStr = format(range.to, 'dd.MM.yyyy')

  //   // Kur çevrimli toplam tutarı al
  //   const totalDisplay = convert(totalPrice, listing.currency)

  //   // JSON'dan e-posta şablonunu al (veya doğrudan string olarak kur)
  //   const subject = t('rentalEmailSubject', {
  //     title: displayTitle,
  //   })
  //   const body = t('rentalEmailBody', {
  //     sellerName: sellerName,
  //     title: displayTitle,
  //     from: fromStr,
  //     to: toStr,
  //     days: selectedDays,
  //     total: totalDisplay,
  //     url: currentUrl,
  //   })

  //   // Mailto Linkini oluştur
  //   const mailtoLink = `mailto:${sellerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  //   window.location.assign(mailtoLink)
  // }

  // handleRentalRequest fonksiyonunu bul ve bu blokla değiştir:
  const handleRentalRequest = () => {
    if (!range?.from || !range?.to) return alert('Lütfen tarih aralığı seçin.')

    // 1. Bilgileri bir paket haline getiriyoruz
    const rentalDetails = {
      listingId: listing.id,
      title: displayTitle,
      startDate: range.from.toISOString(),
      endDate: range.to.toISOString(),
      totalAmount: totalPrice, // Ham sayı (convert edilmemiş hali)
      currency: listing.currency || 'TRY',
      orderType: 'rental',
      days: selectedDays,
    }

    // 2. Bu bilgiyi tarayıcı sekmeyi kapatana kadar saklar (sessionStorage)
    sessionStorage.setItem('pending_rental', JSON.stringify(rentalDetails))

    // 3. Checkout sayfasına yönlendir
    router.push('/checkout')
  }
  const handleBuyNow = () => {
    if (isOutOfStock) return // Stok yoksa işlem yapma
    handleAdd() // Önce sepete ekleme fonksiyonunu çalıştır
    router.push('/checkout') // Sonra doğrudan checkout sayfasına yönlendir
  }
  const isOutOfStock = listing.allowOnlinePurchase && (listing.stock || 0) <= 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-32 transition-colors duration-500 text-foreground">
      <div className="max-w-[1400px] mx-auto px-6 pt-8">
        <div className="flex justify-between items-start gap-6">
          <ListingHeader title={displayTitle} />
          <div className="mt-10">
            <BookmarkBtn listingId={Number(listing.id)} isInitialBookmarked={isInitialBookmarked} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          <div className="lg:col-span-8 space-y-12">
            <ListingGallery images={images} title={displayTitle} />
            <div className="bg-white dark:bg-slate-900/50 rounded-[3.5rem] p-12 border border-slate-200 dark:border-white/5 shadow-sm">
              <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter italic flex items-center gap-3">
                <div className="w-2 h-8 bg-purple-600 rounded-full" />
                {t('descriptionTitle')}
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                {listing.description && <RichText data={listing.description} />}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 block mb-2">
                {t('price')}
              </span>
              <div className="text-5xl font-black tracking-tighter leading-none">
                {convert(listing.price, listing.currency || 'TRY')}
              </div>
            </div>

            {canBuyOnline && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between text-slate-900 dark:text-white font-black">
                  <span className="text-[10px] uppercase tracking-widest opacity-40">
                    Adet Seçimi
                  </span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-sm outline-none"
                  >
                    {[...Array(Math.min(listing.stock || 1, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 active:scale-95'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    {isOutOfStock ? t('soldOut') : t('addToCart')}
                  </button>
                  <button
                    onClick={handleBuyNow} // 👈 Burayı ekledik
                    disabled={isOutOfStock}
                    className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50' // 👈 Stok yoksa gri ve mat görünüm
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl active:scale-95'
                    }`}
                  >
                    <Zap size={18} fill={isOutOfStock ? 'none' : 'currentColor'} />
                    {isOutOfStock ? t('soldOut') : t('buyNow')}
                  </button>
                </div>
              </div>
            )}
            {listing.isDailyRental && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">
                    Rezervasyon Yap
                  </h3>
                  {selectedDays > 0 && (
                    <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-2 py-1 rounded-lg">
                      {selectedDays} GÜN
                    </span>
                  )}
                </div>

                {/* Takvim Görseli */}
                <div className="flex justify-center bg-slate-50 dark:bg-white/5 rounded-3xl p-2 border border-slate-100 dark:border-white/10 overflow-hidden">
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    disabled={{ before: startOfToday() }} // Geçmiş tarihleri kapat
                    styles={{
                      caption: {
                        color: '#9333ea',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        fontSize: '12px',
                      },
                      head_cell: { fontSize: '10px', fontWeight: 'bold' },
                      cell: { fontSize: '12px' },
                    }}
                  />
                </div>

                {/* Toplam Fiyat ve Buton */}
                {selectedDays > 0 ? (
                  <div className="space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-end p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        Toplam Tutar
                      </span>
                      <span className="text-2xl font-black text-purple-600">
                        {convert(totalPrice, listing.currency)}
                      </span>
                    </div>
                    <button
                      onClick={handleRentalRequest}
                      className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      KİRALAMA TALEBİ GÖNDER
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-center text-slate-400 font-medium italic">
                    * Lütfen kiralamak istediğiniz tarih aralığını seçin.
                  </p>
                )}
              </div>
            )}
            <ListingSellerCard seller={listing.author} listing={listing} />
            <ListingSpecs listing={listing} />
          </div>
        </div>
      </div>
    </div>
  )
}
