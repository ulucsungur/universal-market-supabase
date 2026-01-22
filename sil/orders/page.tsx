import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Search, Package, ChevronDown, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations('Orders')

  if (!session?.user) redirect(`/${locale}/login`)

  const payload = await getPayload({ config: configPromise })

  // Siparişleri çekiyoruz (Alıcıya göre filtrele ve İlan detaylarını getir)
  const orders = await payload.find({
    collection: 'orders',
    where: {
      buyer: { equals: Number(session.user.id) },
    },
    sort: '-createdAt',
    depth: 2, // İlanın başlığı ve resmi için depth 2 şart
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-12 transition-colors">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* ÜST BAŞLIK VE ARAMA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            {t('title')}
          </h1>
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-10 text-sm outline-none focus:border-purple-500 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        {/* SİPARİŞ LİSTESİ */}
        <div className="space-y-10">
          {orders.docs.length > 0 ? (
            orders.docs.map((order: any) => (
              <div
                key={order.id}
                className="border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 shadow-sm"
              >
                {/* SİPARİŞ ÜST BİLGİ ÇUBUĞU (Amazon Style) */}
                <div className="bg-slate-50 dark:bg-white/5 p-6 border-b border-slate-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="space-y-1">
                    <p>{t('orderDate')}</p>
                    <p className="text-slate-900 dark:text-slate-200 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>{t('total')}</p>
                    <p className="text-slate-900 dark:text-slate-200 text-xs">
                      {order.totalAmount?.toLocaleString()} {order.currency || 'TRY'}
                    </p>
                  </div>
                  <div className="space-y-1 hidden md:block">
                    <p>{t('shipTo')}</p>
                    <button className="flex items-center gap-1 text-blue-600 hover:text-purple-600 transition-colors text-xs lowercase first-letter:uppercase font-bold">
                      {order.fullName} <ChevronDown size={14} />
                    </button>
                  </div>
                  <div className="ml-auto text-right space-y-1">
                    <p>
                      {t('orderNo')} #{order.id}
                    </p>
                    <div className="flex gap-4 text-blue-600 text-[9px] font-bold">
                      <Link href={`/orders/${order.id}`} className="hover:underline">
                        {t('details')}
                      </Link>
                      <button className="hover:underline border-l border-slate-300 dark:border-white/10 pl-4">
                        {t('invoice')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* SİPARİŞ İÇERİĞİ */}
                <div className="p-8 flex flex-col md:flex-row gap-10">
                  <div className="flex-1 flex gap-6">
                    {/* Ürün Görseli */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 dark:border-white/5">
                      <Image
                        src={order.listing?.mainImage?.url || ''}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Ürün Bilgisi */}
                    <div className="space-y-3">
                      <h3 className="text-green-600 dark:text-green-400 font-black text-lg uppercase tracking-tighter">
                        {order.status === 'pending' ? t('statusPending') : t('statusPaid')}
                      </h3>
                      <div className="mt-1">
                        <StatusBadge status={order.status} orderType={order.orderType} />
                      </div>
                      <Link
                        href={`/listing/${order.listing?.id}`}
                        className="text-sm font-bold text-slate-800 dark:text-white hover:text-purple-600 transition-all line-clamp-2 uppercase"
                      >
                        {order.listing?.title}
                      </Link>
                      <button className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <Package size={14} /> {t('buyAgain')}
                      </button>
                    </div>
                  </div>

                  {/* AKSİYON BUTONLARI (SAĞ TARAF) */}
                  <div className="flex flex-col gap-3 w-full md:w-64">
                    <button className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      {t('trackPackage')}
                    </button>
                    <button className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      {t('returnItems')}
                    </button>
                    <button className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic text-purple-600">
                      {t('writeReview')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-40 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[4rem]">
              <Package size={64} className="mx-auto text-slate-200 mb-6" />
              <p className="text-slate-400 font-black uppercase tracking-[0.2em]">
                Henüz bir siparişiniz bulunmuyor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
