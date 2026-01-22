export const revalidate = 0
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { ListingDetailClient } from '@/components/listing/ListingDetailClient'
import { auth } from '@/auth'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}): Promise<Metadata> {
  const { id, locale } = await params
  const payload = await getPayload({ config: configPromise })

  try {
    const listing = await payload.findByID({
      collection: 'listings',
      id: id,
      locale: locale as any,
      depth: 1,
    })

    if (!listing) return { title: 'İlan Bulunamadı' }

    // --- NULL VE JSON KONTROLÜ (Hata Giderici) ---
    const rawTitle = listing.title // Bu null, string veya obje olabilir
    let displayTitle = 'İlan Detayı' // Varsayılan (Fallback) değer

    if (rawTitle) {
      if (typeof rawTitle === 'object') {
        // Obje ise dile göre al
        displayTitle = rawTitle[locale] || rawTitle['tr'] || 'İlan'
      } else if (typeof rawTitle === 'string') {
        if (rawTitle.trim().startsWith('{')) {
          // String kılığında JSON ise parçala
          try {
            const parsed = JSON.parse(rawTitle)
            displayTitle = parsed[locale] || parsed['tr'] || rawTitle
          } catch (e) {
            displayTitle = rawTitle
          }
        } else {
          // Düz string ise olduğu gibi kullan
          displayTitle = rawTitle
        }
      }
    }

    return {
      title: displayTitle, // Artık null olma ihtimali yok
      description: displayTitle,
      openGraph: {
        title: displayTitle,
      },
    }
  } catch (error) {
    return { title: 'İlan Detayı' }
  }
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const session = await auth()
  setRequestLocale(locale)

  const payload = await getPayload({ config: configPromise })

  const listing = await payload.findByID({
    collection: 'listings',
    id: id,
    locale: locale as any, // 👈 Buradaki dile rağmen Postgres bazen JSON döner, Client kodu bunu çözecek
    depth: 2,
  })

  if (!listing) return notFound()

  let isInitialBookmarked = false
  if (session?.user?.id) {
    const user = await payload.findByID({ collection: 'users', id: session.user.id })
    isInitialBookmarked =
      ((user as any).bookmarks as any[])?.some(
        (b) => (typeof b === 'object' ? b.id : b) === Number(id),
      ) || false
  }

  return <ListingDetailClient listing={listing} isInitialBookmarked={isInitialBookmarked} />
}

// export const revalidate = 0 // 👈 Sayfanın her zaman taze veri çekmesini sağlar
// import { Metadata } from 'next'
// import { getPayload } from 'payload'
// import configPromise from '@payload-config'
// import { notFound } from 'next/navigation'
// import { setRequestLocale } from 'next-intl/server'
// import { ListingDetailClient } from '@/components/listing/ListingDetailClient'
// import { BookmarkBtn } from '@/components/ui/BookmarkBtn'
// import { auth } from '@/auth'

// // 1. DİNAMİK METADATA (SEO)
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string; locale: string }>
// }): Promise<Metadata> {
//   const { id, locale } = await params
//   const payload = await getPayload({ config: configPromise })

//   try {
//     const listing = await payload.findByID({
//       collection: 'listings',
//       id: id,
//       locale: locale as any,
//       depth: 1,
//     })

//     if (!listing) return { title: 'İlan Bulunamadı' }

//     // KRİTİK DÜZELTME: Null kontrolü yapıp string'e zorluyoruz
//     const title = listing.title || 'İsimsiz İlan'
//     const price = listing.price?.toLocaleString() || '0'
//     const currency = listing.currency || 'TRY'
//     const description = `${price} ${currency} - ${title} detaylarını inceleyin.`

//     return {
//       title: title, // Artık null olamaz, hata giderildi
//       description: description,
//       openGraph: {
//         title: title,
//         description: description,
//         // Resim objesini de güvenli şekilde alalım
//         images: (listing.mainImage as any)?.url ? [{ url: (listing.mainImage as any).url }] : [],
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title: title,
//         description: description,
//       },
//     }
//   } catch (error) {
//     return { title: 'İlan Detayı' }
//   }
// }

// // 2. SAYFA (SERVER COMPONENT)
// export default async function ListingDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string; locale: string }>
// }) {
//   const { id, locale } = await params
//   const session = await auth()
//   setRequestLocale(locale) // i18n güvenliği için

//   const payload = await getPayload({ config: configPromise })

//   // Veriyi sunucuda (Local API) çekiyoruz - Çok daha hızlı ve güvenli
//   const listing = await payload.findByID({
//     collection: 'listings',
//     id: id,
//     locale: locale as any,
//     depth: 2, // Resimler ve yazar bilgisi için depth 2 kalsın
//   })

//   if (!listing) return notFound()

//   // --- FAVORİ KONTROLÜ ---
//   let isInitialBookmarked = false
//   if (session?.user?.id) {
//     const user = await payload.findByID({
//       collection: 'users',
//       id: session.user.id,
//     })
//     // Kullanıcının bookmarks dizisinde bu ilan var mı?
//     isInitialBookmarked =
//       (user.bookmarks as any[])?.some((b) => (typeof b === 'object' ? b.id : b) === Number(id)) ||
//       false
//   }

//   // Veriyi Client bileşenine gönderiyoruz
//   return <ListingDetailClient listing={listing} isInitialBookmarked={isInitialBookmarked} />
// }

//metadata data düzenlemesi öncesi
// 'use client'
// import React, { useState, useEffect } from 'react'
// import { RichText } from '@payloadcms/richtext-lexical/react'
// import { useTranslations } from 'next-intl'
// import { useCurrency } from '@/providers/Currency'
// import { ListingHeader } from '@/components/listing/ListingHeader'
// import { ListingGallery } from '@/components/listing/ListingGallery'
// import { ListingSpecs } from '@/components/listing/ListingSpecs'
// import { ListingSellerCard } from '@/components/listing/ListingSellerCard'

// export default function ListingDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string; locale: string }>
// }) {
//   const t = useTranslations('CategoryPage')
//   const [listing, setListing] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const { convert } = useCurrency()

//   useEffect(() => {
//     const fetchData = async () => {
//       const { id, locale } = await params
//       const res = await fetch(
//         `${window.location.origin}/api/listings/${id}?locale=${locale}&depth=2`,
//       )
//       const data = await res.json()
//       setListing(data)
//       setLoading(false)
//     }
//     fetchData()
//   }, [params])

//   if (loading)
//     return (
//       <div className="p-20 text-center animate-pulse text-purple-600 font-black uppercase">
//         Yükleniyor...
//       </div>
//     )
//   if (!listing) return null

//   // const images = [
//   //   listing.mainImage?.url,
//   //   ...(listing.gallery?.map((img: any) => img.url) || []),
//   // ].filter(Boolean)
//   // Array.from(new Set(...)) kullanarak kopyaları siliyoruz
//   const images = Array.from(
//     new Set([listing.mainImage?.url, ...(listing.gallery?.map((img: any) => img.url) || [])]),
//   ).filter(Boolean) as string[]

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-32 transition-colors duration-500">
//       <div className="max-w-[1400px] mx-auto px-6 pt-8">
//         <ListingHeader title={listing.title} />

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
//           {/* SOL SÜTUN */}
//           <div className="lg:col-span-8 space-y-12">
//             <ListingGallery images={images} title={listing.title} />

//             <div className="bg-white dark:bg-slate-900/50 rounded-[3.5rem] p-12 border border-slate-200 dark:border-white/5 shadow-sm">
//               <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter italic flex items-center gap-3 text-slate-900 dark:text-white">
//                 <div className="w-2 h-8 bg-purple-600 rounded-full" />
//                 {t('descriptionTitle')}
//               </h2>
//               <div className="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-slate-600 dark:text-slate-400">
//                 {listing.description && <RichText data={listing.description} />}
//               </div>
//             </div>
//           </div>

//           {/* SAĞ SÜTUN */}
//           <div className="lg:col-span-4 space-y-8">
//             <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
//               <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 block mb-2">
//                 {t('price')}
//               </span>
//               <div className="text-5xl font-black tracking-tighter leading-none">
//                 {convert(listing.price, listing.currency || 'TRY')}
//                 <span className="text-2xl font-light opacity-50"></span>
//               </div>
//             </div>

//             <ListingSellerCard
//               seller={listing.author}
//               listing={listing} // listingTitle: string yerine direkt listing objesini gönderiyoruz
//             />
//             <ListingSpecs listing={listing} />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
