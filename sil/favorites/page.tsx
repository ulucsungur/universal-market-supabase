import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ListingCard } from '@/components/ui/ListingCard'
import { HeartOff } from 'lucide-react'

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations('Dashboard')

  if (!session?.user) redirect(`/${locale}/login`)

  const payload = await getPayload({ config: configPromise })

  // Kullanıcıyı bookmarks verisiyle birlikte çekiyoruz
  try {
    const user = await payload.findByID({
      collection: 'users',
      id: session.user.id,
      depth: 2, // İlan detaylarını (resim vb) almak için depth 2
    })

    const favoriteListings = (user as any).bookmarks || []

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors">
        <div className="max-w-[1400px] mx-auto px-6">
          <header className="mb-16 space-y-4 text-center md:text-left">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
              FAVORİLERİM
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Beğendiğiniz ilanları buradan takip edebilirsiniz.
            </p>
          </header>

          {favoriteListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {favoriteListings.map((item: any) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[4rem] bg-white dark:bg-slate-900/30">
              <HeartOff size={64} className="mx-auto text-slate-200 mb-6" />
              <p className="text-slate-400 font-bold uppercase tracking-widest">
                Henüz favori ilanınız bulunmuyor.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    // Eğer veritabanında kullanıcı bulunamazsa (yeni kayıt henüz yansımadıysa)
    console.error('Favoriler yüklenemedi')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 uppercase font-black opacity-20">
          Henüz favori listeniz hazır değil.
        </p>
      </div>
    )
  }
}
