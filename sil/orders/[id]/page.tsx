import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { MapPin, CreditCard, Package, CalendarDays, ArrowLeft, Printer } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PrintButton } from '@/components/ui/PrintButton'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  setRequestLocale(locale)

  const session = await auth()
  if (!session?.user) redirect(`/${locale}/login`)

  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('Orders.OrderDetails')

  // 1. SİPARİŞİ ÇEK
  const order = await payload.findByID({
    collection: 'orders',
    id: id,
    depth: 2, // İlan detayları için 2 şart
  })

  if (!order) return notFound()

  // 2. YETKİ KONTROLÜ
  const isAdmin = session.user.role === 'admin'

  // Alıcı ID'sini güvenli bir şekilde alalım
  const buyerId = typeof order.buyer === 'object' ? order.buyer?.id : order.buyer
  const isBuyer = Number(buyerId) === Number(session.user.id)

  // Satıcı ID'sini güvenli bir şekilde alalım (Listing üzerinden)
  const listingData = order.listing as any
  const sellerId =
    typeof listingData?.author === 'object' ? listingData?.author?.id : listingData?.author
  const isSeller = Number(sellerId) === Number(session.user.id)

  if (!isAdmin && !isBuyer && !isSeller) {
    redirect(`/${locale}/orders`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-12 transition-colors duration-500 text-foreground">
      <div className="max-w-[1000px] mx-auto px-6">
        {/* ÜST NAVİGASYON */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/orders"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft size={16} /> Geri Dön
          </Link>
          <PrintButton />
        </div>

        <div className="space-y-8">
          {/* 1. BAŞLIK VE STATÜ */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h1 className="text-3xl font-black uppercase tracking-tighter">{t('title')}</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Sipariş No: #{order.id}
              </p>
            </div>
            <StatusBadge status={order.status as string} orderType={order.orderType as string} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 2. TESLİMAT BİLGİLERİ */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-600 flex items-center gap-2">
                  <MapPin size={16} /> {t('billingInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  <div className="space-y-2">
                    <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                      Alıcı Bilgisi
                    </p>
                    <p className="font-black text-slate-900 dark:text-white uppercase">
                      {order.fullName}
                    </p>
                    <p className="text-slate-500 font-medium">{order.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                      Adres Detayı
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      {order.shippingAddress}
                    </p>
                    <p className="font-black text-[10px] text-slate-900 dark:text-white uppercase">
                      {order.city} / {order.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. ÜRÜN DETAYI */}
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-600 mb-8">
                  {t('items')}
                </h3>
                <div className="flex gap-6 items-center">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                    <Image
                      src={(order.listing as any)?.mainImage?.url || ''}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-black uppercase text-slate-900 dark:text-white">
                      {(order.listing as any)?.title}
                    </h4>
                    {order.orderType === 'rental' && (
                      <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">
                        <CalendarDays size={12} />
                        {new Date(order.startDate as string).toLocaleDateString()} -{' '}
                        {new Date(order.endDate as string).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. ÖDEME ÖZETİ (Sağ Taraf) */}
            <aside className="space-y-8">
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                  {t('summary')}
                </h3>
                <div className="space-y-4 border-b border-white/10 pb-6">
                  <div className="flex justify-between text-xs font-medium opacity-70">
                    <span>{t('subtotal')}</span>
                    <span>
                      {order.totalAmount?.toLocaleString()} {order.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-green-400">
                    <span>{t('shipping')}</span>
                    <span className="font-bold">ÜCRETSİZ</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase">{t('grandTotal')}</span>
                  <span className="text-4xl font-black tracking-tighter text-purple-400">
                    {order.totalAmount?.toLocaleString()} {order.currency}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
