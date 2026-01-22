import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { User, Phone, MapPin, Package, CalendarDays, CreditCard } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StatusUpdateBtns } from '@/components/sales/StatusUpdateBtns'

export default async function SalesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations('Sales')

  // 1. Yetki Kontrolü: Sadece admin ve agent girebilir
  const isAuthorized = session?.user?.role === 'admin' || session?.user?.role === 'agent'
  if (!isAuthorized) redirect(`/${locale}`)

  const payload = await getPayload({ config: configPromise })
  const userId = Number(session?.user?.id)

  // 2. SADECE BU SATICIYA GELEN SİPARİŞLERİ ÇEK
  // Sorgu: İlanın sahibinin (author) mevcut kullanıcı olduğu siparişler
  const incomingOrders = await payload.find({
    collection: 'orders',
    where: {
      'listing.author': {
        equals: userId,
      },
    },
    sort: '-createdAt',
    depth: 2, // İlan detaylarını ve alıcı bilgilerini çekmek için
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-12 transition-colors">
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-16 space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
            {t('title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t('subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {incomingOrders.docs.length > 0 ? (
            incomingOrders.docs.map((order: any) => (
              <div
                key={order.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-500/5 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* SOL: ÜRÜN BİLGİSİ */}
                  <div className="lg:w-1/3 p-8 border-r border-slate-100 dark:border-white/5 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          order.orderType === 'rental'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {order.orderType === 'rental' ? 'Kiralama' : 'Satın Alma'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">#{order.id}</span>
                    </div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={order.listing?.mainImage?.url || ''}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white line-clamp-2">
                      {order.listing?.title}
                    </h3>
                    <p className="text-2xl font-black text-purple-600">
                      {order.totalAmount?.toLocaleString()} {order.currency || 'TRY'}
                    </p>
                  </div>

                  {/* SAĞ: MÜŞTERİ VE ADRES BİLGİLERİ */}
                  <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* ALICI BİLGİSİ */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <User size={14} className="text-purple-600" /> {t('buyerInfo')}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-bold uppercase">
                            {t('customer')}
                          </span>
                          <span className="font-black text-slate-900 dark:text-white">
                            {order.fullName}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-bold uppercase">
                            {t('phone')}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white underline">
                            {order.phone}
                          </span>
                        </div>
                      </div>

                      {/* KİRALAMA TARİHLERİ (Varsa) */}
                      {order.orderType === 'rental' && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase mb-2">
                            <CalendarDays size={14} /> Tarihler
                          </div>
                          <p className="text-xs font-bold text-slate-700 dark:text-blue-200">
                            {new Date(order.startDate).toLocaleDateString()} -{' '}
                            {new Date(order.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* TESLİMAT ADRESİ */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <MapPin size={14} className="text-purple-600" /> {t('shippingAddress')}
                      </h4>
                      <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 italic text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {order.shippingAddress}
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between not-italic font-black text-[10px]">
                          <span>{order.city}</span>
                          <span>{order.zipCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <StatusBadge status={order.status} orderType={order.orderType} />
                    <StatusUpdateBtns
                      orderId={order.id}
                      currentStatus={order.status}
                      orderType={order.orderType}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-40 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[4rem]">
              <Package size={64} className="mx-auto text-slate-200 mb-6" />
              <p className="text-slate-400 font-bold uppercase tracking-widest">{t('noSales')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
