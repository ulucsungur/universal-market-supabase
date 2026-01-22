'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/providers/Cart'
import { useCurrency } from '@/providers/Currency'
import { createOrderAction } from '@/lib/actions/order'
import { CreditCard, ShieldCheck, Loader2, MapPin, CalendarDays } from 'lucide-react'
import { useRouter } from '@/i18n/routing'
import { format } from 'date-fns'

export default function CheckoutPage() {
  const { cart, cartCount, clearCart } = useCart()
  const { convert } = useCurrency()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Kiralama verisi için yeni state
  const [rentalData, setRentalData] = useState<any>(null)

  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    shippingAddress: '',
    city: '',
    zipCode: '',
  })

  // SAYFA AÇILDIĞINDA KİRALAMA VAR MI KONTROL ET
  useEffect(() => {
    const saved = sessionStorage.getItem('pending_rental')
    if (saved) {
      setRentalData(JSON.parse(saved))
    }
  }, [])

  // Toplam tutarı hesapla (Kiralama varsa onu kullan, yoksa sepeti)
  const total = rentalData
    ? rentalData.totalAmount
    : cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (rentalData) {
        // --- DURUM A: KİRALAMA İŞLEMİ ---
        const res = await createOrderAction({
          ...addressData,
          listingId: rentalData.listingId,
          amount: rentalData.totalAmount,
          quantity: 1,
          orderType: 'rental',
          startDate: rentalData.startDate,
          endDate: rentalData.endDate,
        })
        if (res.error) throw new Error(res.error)
        sessionStorage.removeItem('pending_rental')
      } else {
        // --- DURUM B: NORMAL SATIN ALMA (SEPET) ---
        for (const item of cart) {
          const res = await createOrderAction({
            ...addressData,
            listingId: item.id,
            amount: item.price * item.quantity,
            quantity: item.quantity,
            orderType: 'purchase',
          })
          if (res.error) throw new Error(res.error)
        }
        clearCart()
      }

      alert('İşleminiz Başarıyla Tamamlandı!')
      router.push('/orders')
    } catch (err: any) {
      alert(`Hata: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* SOL: ADRES VE KART FORMU */}
        <div className="lg:col-span-8 space-y-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
            {rentalData ? 'Kiralama Detayları' : 'Sipariş Detayları'}
          </h2>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* ADRES FORMU (Daha öncekiyle aynı) */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-6">
              <div className="flex items-center gap-3 text-purple-600 font-black text-[10px] tracking-[0.3em] uppercase">
                <MapPin size={16} /> Teslimat / Fatura Bilgileri
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Ad Soyad"
                  value={addressData.fullName}
                  onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
                />
                <input
                  required
                  placeholder="Telefon"
                  value={addressData.phone}
                  onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <textarea
                required
                placeholder="Adres"
                value={addressData.shippingAddress}
                onChange={(e) =>
                  setAddressData({ ...addressData, shippingAddress: e.target.value })
                }
                rows={3}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm resize-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Şehir"
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
                />
                <input
                  placeholder="Posta Kodu"
                  value={addressData.zipCode}
                  onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
                />
              </div>
            </div>

            {/* ÖDEME BİLGİLERİ (SİMÜLASYON) */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-6">
              <div className="flex items-center gap-3 text-purple-600 font-black text-[10px] tracking-[0.3em] uppercase">
                <CreditCard size={16} /> Ödeme Bilgileri
              </div>

              <input
                required
                placeholder="Kart Üzerindeki İsim"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
              />

              <div className="relative">
                <input
                  required
                  placeholder="**** **** **** ****"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
                />
              </div>

              {/* GERİ GELEN KISIM: 2'Lİ GRID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 ml-2 uppercase">
                    Son Kullanma
                  </label>
                  <input
                    required
                    placeholder="AA/YY"
                    maxLength={5}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 ml-2 uppercase">
                    Güvenlik Kodu
                  </label>
                  <input
                    required
                    placeholder="CVV"
                    maxLength={3}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm text-center"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={20} /> {rentalData ? 'Kiralamayı Onayla' : 'Siparişi Onayla'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* SAĞ: ÖZET ALANI */}
        <div className="lg:col-span-4 h-fit sticky top-32">
          <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl space-y-10 border border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-50 border-b border-white/10 pb-4">
              Özet
            </h3>

            {rentalData ? (
              /* KİRALAMA ÖZETİ */
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-300">
                    {rentalData.title}
                  </p>
                  <p className="text-[9px] font-bold text-purple-400 uppercase italic flex items-center gap-2 mt-2">
                    <CalendarDays size={14} />
                    {format(new Date(rentalData.startDate), 'dd MMM')} -{' '}
                    {format(new Date(rentalData.endDate), 'dd MMM')}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">
                    {rentalData.days} Günlük Kiralama
                  </p>
                </div>
              </div>
            ) : (
              /* SEPET ÖZETİ */
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <p className="text-[10px] font-black uppercase truncate text-slate-300">
                      {item.title}
                    </p>
                    <span className="font-black text-xs text-purple-400">
                      {convert(item.price * item.quantity, item.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
              <span className="text-[10px] font-black uppercase opacity-50">Toplam</span>
              <span className="text-4xl font-black tracking-tighter text-white">
                {convert(total, 'TRY')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import React, { useState } from 'react'
// import { useCart } from '@/providers/Cart'
// import { useCurrency } from '@/providers/Currency'
// import { createOrderAction } from '@/lib/actions/order'
// import { CreditCard, ShieldCheck, Loader2, MapPin } from 'lucide-react'
// import { useRouter } from '@/i18n/routing'

// export default function CheckoutPage() {
//   const { cart, cartCount, clearCart } = useCart()
//   const { convert } = useCurrency()
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)

//   // 1. ADRES STATE TANIMI
//   const [addressData, setAddressData] = useState({
//     fullName: '',
//     phone: '',
//     shippingAddress: '',
//     city: '',
//     zipCode: '',
//   })

//   const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

//   const handlePayment = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       // Simülasyon: Her ürünü tek tek siparişe dönüştür
//       for (const item of cart) {
//         const res = await createOrderAction({
//           listingId: item.id,
//           amount: item.price * item.quantity,
//           orderType: 'purchase',
//           // Adres verileri buradan Action'a gidiyor
//           fullName: addressData.fullName,
//           phone: addressData.phone,
//           shippingAddress: addressData.shippingAddress,
//           city: addressData.city,
//           zipCode: addressData.zipCode,
//         })

//         if (res.error) {
//           throw new Error(res.error)
//         }
//       }

//       alert('Siparişiniz başarıyla alındı!')
//       clearCart()
//       router.push('/orders')
//     } catch (err: any) {
//       alert(`Bir hata oluştu: ${err.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (cartCount === 0)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="font-black uppercase tracking-widest opacity-20">Sepetiniz boş.</p>
//       </div>
//     )

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors duration-500">
//       <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
//         {/* SOL: FORM ALANI */}
//         <div className="lg:col-span-8 space-y-8">
//           <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white leading-none">
//             Sipariş Detayları
//           </h2>

//           <form onSubmit={handlePayment} className="space-y-6">
//             {/* TESLİMAT BİLGİLERİ */}
//             <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-6">
//               <div className="flex items-center gap-3 text-purple-600 font-black text-[10px] tracking-[0.3em] uppercase">
//                 <MapPin size={16} /> Teslimat Bilgileri
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   required
//                   placeholder="Ad Soyad"
//                   value={addressData.fullName}
//                   onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
//                   className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
//                 />
//                 <input
//                   required
//                   placeholder="Telefon (05xx...)"
//                   value={addressData.phone}
//                   onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
//                   className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
//                 />
//               </div>

//               <textarea
//                 required
//                 placeholder="Açık Adres (Mahalle, Sokak, No...)"
//                 value={addressData.shippingAddress}
//                 onChange={(e) =>
//                   setAddressData({ ...addressData, shippingAddress: e.target.value })
//                 }
//                 rows={3}
//                 className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm resize-none"
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   required
//                   placeholder="Şehir"
//                   value={addressData.city}
//                   onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
//                   className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
//                 />
//                 <input
//                   placeholder="Posta Kodu"
//                   value={addressData.zipCode}
//                   onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
//                   className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
//                 />
//               </div>
//             </div>

//             {/* ÖDEME BİLGİLERİ (SİMÜLASYON) */}
//             <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-6">
//               <div className="flex items-center gap-3 text-purple-600 font-black text-[10px] tracking-[0.3em] uppercase">
//                 <CreditCard size={16} /> Kart Bilgileri
//               </div>
//               <input
//                 required
//                 placeholder="Kart Üzerindeki İsim"
//                 className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
//               />
//               <input
//                 required
//                 placeholder="**** **** **** ****"
//                 className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-purple-500 text-sm"
//               />
//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   required
//                   placeholder="AA/YY"
//                   className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none text-sm"
//                 />
//                 <input
//                   required
//                   placeholder="CVV"
//                   className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none text-sm"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 <>
//                   <ShieldCheck size={20} /> Siparişi Onayla
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* SAĞ: ÖZET ALANI */}
//         <div className="lg:col-span-4 h-fit sticky top-32">
//           <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl space-y-10 border border-white/5">
//             <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-50 border-b border-white/10 pb-4">
//               Sipariş Özeti
//             </h3>
//             <div className="space-y-6">
//               {cart.map((item) => (
//                 <div key={item.id} className="flex justify-between gap-4">
//                   <div className="space-y-1 overflow-hidden">
//                     <p className="text-[10px] font-black uppercase truncate text-slate-300">
//                       {item.title}
//                     </p>
//                     <p className="text-[9px] font-bold text-slate-500 uppercase italic">
//                       Adet: {item.quantity}
//                     </p>
//                   </div>
//                   <span className="font-black text-xs text-purple-400 whitespace-nowrap">
//                     {convert(item.price * item.quantity, item.currency)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <div className="pt-6 border-t border-white/10 flex justify-between items-end">
//               <span className="text-[10px] font-black uppercase opacity-50">Toplam Tutar</span>
//               <span className="text-4xl font-black tracking-tighter text-white">
//                 {convert(total, 'TRY')}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
