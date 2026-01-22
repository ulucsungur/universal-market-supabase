'use client'

import React, { useState, useEffect } from 'react' // 1. useEffect ekledik
import Image from 'next/image'
import { User, ShieldCheck, Phone, MessageSquare, Mail, Instagram, Facebook } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { MessageModal } from './MessageModal'

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export const ListingSellerCard = ({ seller, listing }: { seller: any; listing: any }) => {
  const t = useTranslations('CategoryPage')
  const [showPhone, setShowPhone] = useState(false)
  const [mounted, setMounted] = useState(false) // 2. Mount kontrolü ekledik

  // Bileşen tarayıcıya yüklendiğinde çalışır
  useEffect(() => {
    setMounted(true)
  }, [])

  const name = seller?.name || 'Satıcı Bilgisi Yok'
  const email = seller?.email || ''
  const phone = seller?.phone || ''
  const instagram = seller?.instagram
  const facebook = seller?.facebook

  // 3. URL'i sadece 'mounted' olduktan sonra alıyoruz
  const listingUrl = mounted ? window.location.origin + window.location.pathname : ''

  const handleWhatsApp = () => {
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone) {
      alert('Numara eksik.')
      return
    }
    const text = `Merhaba, "${listing.title}" ilanınızla ilgileniyorum.\nİlan Linki: ${listingUrl}`
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  // 4. Mailto linkini de 'mounted' durumuna bağladık
  const mailSubject = encodeURIComponent(`İlan Hakkında: ${listing.title}`)
  const mailBody = encodeURIComponent(
    `Merhaba ${name},\n\nBu ilanınızla ilgileniyorum: ${listingUrl}`,
  )
  const mailtoLink = mounted ? `mailto:${email}?subject=${mailSubject}&body=${mailBody}` : '#'

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 shadow-sm">
      {/* ... Üst profil kısmı aynı ... */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-16 h-16 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-600 border border-purple-600/20 overflow-hidden font-black">
          {seller?.image?.url ? (
            <Image src={seller.image.url} alt={name} fill className="object-cover" unoptimized />
          ) : (
            <User size={32} />
          )}
        </div>
        <div className="text-slate-900 dark:text-white font-black">
          <h4 className="text-lg uppercase tracking-tight leading-none">{name}</h4>
          <div className="flex items-center gap-1 text-[9px] text-purple-500 tracking-widest uppercase mt-1">
            <ShieldCheck size={12} /> GÜVENİLİR ÜYE
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Telefon Butonu */}
        <button
          onClick={() => setShowPhone(true)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10"
        >
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-purple-600" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Telefon
            </span>
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white uppercase">
            {phone ? (showPhone ? phone : `${phone.substring(0, 5)} *** ** **`) : '---'}
          </span>
        </button>
        {/* MESAJ GÖNDER BUTONU */}
        <button
          onClick={() => setIsModalOpen(true)} // Tıklayınca modalı aç
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <MessageSquare size={16} /> {t('contactSeller')}
        </button>

        {/* Sosyal İkonlar */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleWhatsApp}
            className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 border border-green-500/20 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm"
          >
            <WhatsAppIcon />
          </button>

          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace('@', '')}`}
              target="_blank"
              className="w-12 h-12 rounded-xl bg-pink-600/10 text-pink-600 border border-pink-600/20 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-sm"
            >
              <Instagram size={20} />
            </a>
          )}

          {facebook && (
            <a
              href={facebook}
              target="_blank"
              className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-600/20 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <Facebook size={20} />
            </a>
          )}

          <a
            href={mailtoLink}
            className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-sm"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
      {/* MESAJ MODALI BURAYA EKLENDİ */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sellerId={Number(seller.id || seller)}
        listingId={Number(listing.id)}
        listingTitle={listing.title}
      />
    </div>
  )
}

//bookmark comiite öncesidir
// 'use client'

// import React, { useState } from 'react'
// import Image from 'next/image'
// import { User, ShieldCheck, Phone, MessageSquare, Mail, Instagram, Facebook } from 'lucide-react'
// import { useTranslations } from 'next-intl'
// import Link from 'next/link'

// // WhatsApp İkon SVG
// const WhatsAppIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
//   </svg>
// )

// export const ListingSellerCard = ({ seller, listing }: { seller: any; listing: any }) => {
//   const t = useTranslations('CategoryPage')
//   const [showPhone, setShowPhone] = useState(false)

//   // Veritabanı Bilgileri
//   const name = seller?.name || 'Satıcı Bilgisi Yok'
//   const email = seller?.email || ''
//   const phone = seller?.phone || ''
//   const instagram = seller?.instagram
//   const facebook = seller?.facebook

//   // URL Hazırlığı (İlişikli mesaj için)
//   const listingUrl =
//     typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''

//   // 1. WhatsApp: Sadece rakamları ayıklar, ülke kodunu kullanıcı nasıl girdiyse öyle bırakır
//   // Örn: +90 532... -> 90532... olur.
//   const handleWhatsApp = () => {
//     const cleanPhone = phone.replace(/\D/g, '') // Sadece rakamları al (+ ve boşlukları sil)
//     if (!cleanPhone) {
//       alert('Numara eksik.')
//       return
//     }
//     const message = `Merhaba, "${listing.title}" ilanınızla ilgileniyorum.\nİlan Linki: ${listingUrl}`
//     window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
//   }

//   // 2. Email Linki
//   const mailSubject = encodeURIComponent(`İlan Hakkında: ${listing.title}`)
//   const mailBody = encodeURIComponent(
//     `Merhaba ${name},\n\nBu ilanınızla ilgileniyorum: ${listingUrl}`,
//   )
//   const mailtoLink = `mailto:${email}?subject=${mailSubject}&body=${mailBody}`

//   return (
//     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 shadow-sm">
//       {/* Üst Kısım: Profil */}
//       <div className="flex items-center gap-4 mb-8">
//         <div className="relative w-16 h-16 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-600 border border-purple-600/20 overflow-hidden font-black">
//           {seller?.image?.url ? (
//             <Image src={seller.image.url} alt={name} fill className="object-cover" unoptimized />
//           ) : (
//             <User size={32} />
//           )}
//         </div>
//         <div className="text-slate-900 dark:text-white font-black">
//           <Link href={`/seller/${seller.id || seller}`}>
//             <h4 className="text-lg font-black uppercase text-slate-900 dark:text-white hover:text-purple-600 transition-colors cursor-pointer leading-none">
//               {name}
//             </h4>
//           </Link>
//           <div className="flex items-center gap-1 text-[9px] text-purple-500 tracking-widest uppercase mt-1">
//             <ShieldCheck size={12} /> GÜVENİLİR ÜYE
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {/* Telefon Göster/Gizle */}
//         <button
//           onClick={() => setShowPhone(true)}
//           className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10"
//         >
//           <div className="flex items-center gap-3">
//             <Phone size={16} className="text-purple-600" />
//             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
//               Telefon
//             </span>
//           </div>
//           <span className="font-bold text-sm text-slate-900 dark:text-white">
//             {phone ? (showPhone ? phone : `${phone.substring(0, 5)} *** ** **`) : '---'}
//           </span>
//         </button>

//         {/* Ana İletişim Butonu (E-posta'yı açar) */}
//         <a
//           href={mailtoLink}
//           className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
//         >
//           <MessageSquare size={16} /> {t('contactSeller')}
//         </a>

//         {/* Sosyal İkonlar */}
//         <div className="flex items-center justify-center gap-3 pt-2">
//           {/* WhatsApp */}
//           <button
//             onClick={handleWhatsApp}
//             className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 border border-green-500/20 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"
//           >
//             <WhatsAppIcon />
//           </button>

//           {/* Instagram */}
//           {instagram && (
//             <a
//               href={`https://instagram.com/${instagram.replace('@', '')}`}
//               target="_blank"
//               className="w-12 h-12 rounded-xl bg-pink-600/10 text-pink-600 border border-pink-600/20 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"
//             >
//               <Instagram size={20} />
//             </a>
//           )}

//           {/* Facebook */}
//           {facebook && (
//             <a
//               href={facebook}
//               target="_blank"
//               className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-600/20 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
//             >
//               <Facebook size={20} />
//             </a>
//           )}

//           {/* E-posta (Geri Geldi!) */}
//           <a
//             href={mailtoLink}
//             className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
//           >
//             <Mail size={20} />
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }
