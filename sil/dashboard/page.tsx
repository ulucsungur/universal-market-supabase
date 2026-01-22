import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { AdminCommentManager } from '@/components/dashboard/AdminCommentManager'
import { Package } from 'lucide-react'

// Sayfanın her zaman güncel kalmasını sağlayalım
export const revalidate = 0

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await auth()
  if (!session?.user) redirect(`/${locale}/login`)

  const payload = await getPayload({ config: configPromise })
  const userId = Number(session.user.id)
  const t = await getTranslations('Dashboard')

  try {
    // TÜM İSTATİSTİKLERİ PARALEL ÇEKELİM
    const [myListings, mySales, unreadMessages, pendingComments] = await Promise.all([
      // 1. Aktif İlan Sayısı
      payload.find({
        collection: 'listings',
        where: { author: { equals: userId } },
        limit: 1,
      }),
      // 2. Toplam Satış Sayısı ve Son Satışlar (Recent Sales için de bunu kullanacağız)
      payload.find({
        collection: 'orders',
        where: { 'listing.author': { equals: userId } },
        limit: 5,
        sort: '-createdAt',
        depth: 1,
      }),
      // 3. Okunmamış Mesaj Sayısı
      payload.find({
        collection: 'messages',
        where: { and: [{ to: { equals: userId } }, { isRead: { equals: false } }] },
        limit: 1,
      }),
      // 4. Onay Bekleyen Yorumlar (Sadece Admin İçin)
      session.user.role === 'admin'
        ? payload.find({
            collection: 'comments',
            where: { status: { equals: 'pending' } },
            depth: 1,
          })
        : { docs: [] },
    ])

    // --- VERİ SERİLEŞTİRME (KRİTİK): ---
    // Payload nesnelerini saf JSON nesnelerine çevirerek "Unexpected response" hatasını bitiriyoruz.
    const stats = JSON.parse(
      JSON.stringify({
        listingsCount: myListings.totalDocs || 0,
        salesCount: mySales.totalDocs || 0,
        messagesCount: unreadMessages.totalDocs || 0,
      }),
    )

    const activities = JSON.parse(
      JSON.stringify(
        mySales.docs.map((order: any) => ({
          id: order.id,
          text: `Yeni Satış: ${order.listing?.title || 'İlan'}`,
          time: new Date(order.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US'),
        })),
      ),
    )

    const sanitizedComments = JSON.parse(JSON.stringify(pendingComments.docs || []))

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-12 transition-colors duration-500 text-foreground">
        <div className="max-w-[1400px] mx-auto px-6 space-y-12">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                {t('welcome')}{' '}
                <span className="text-purple-600">{session.user.name?.split(' ')[0]}</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
                Kişisel Yönetim Paneli
              </p>
            </div>
            <QuickActions />
          </header>

          <DashboardStats stats={stats} />

          {session.user.role === 'admin' && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <AdminCommentManager comments={sanitizedComments} />
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DashboardCharts />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-purple-600 mb-8">
                Son Aktiviteler
              </h3>

              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map((act: any) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-4 border-b border-slate-100 dark:border-white/5 pb-4 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 flex-shrink-0">
                        <Package size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase leading-tight">
                          {act.text}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{act.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm italic">
                    Henüz yeni bir aktivite bulunmuyor.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard Veri Hatası:', error)
    return (
      <div className="p-20 text-center uppercase font-black">
        Veriler yüklenirken bir hata oluştu.
      </div>
    )
  }
}
