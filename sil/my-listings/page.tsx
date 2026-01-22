import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { ExternalLink, Edit3, PackageOpen } from 'lucide-react'
import { DeleteListingBtn } from '@/components/ui/DeleteListingBtn'

export default async function MyListingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations('Dashboard')

  if (!session?.user) redirect(`/${locale}/login`)

  const payload = await getPayload({ config: configPromise })

  // Kullanıcı ID'sini dün çözdüğümüz gibi sayıya çeviriyoruz
  const userId = Number(session.user.id)

  const myListings = await payload.find({
    collection: 'listings',
    locale: locale as any,
    where: {
      author: { equals: userId },
    },
    sort: '-createdAt',
    depth: 1,
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors">
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
              {t('title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('subtitle')}</p>
          </div>
          <Link
            href="/add-listing"
            className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 shadow-xl shadow-purple-600/20 transition-all active:scale-95"
          >
            + Yeni İlan
          </Link>
        </header>

        <div className="space-y-4">
          {myListings.docs.length > 0 ? (
            myListings.docs.map((item: any) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-all duration-500"
              >
                {/* Resim */}
                <div className="relative w-full md:w-56 aspect-video rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  <Image
                    src={item.mainImage?.url || ''}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Bilgi */}
                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                      ID: {item.id}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-md">
                    {item.title}
                  </h3>
                  <p className="text-lg font-bold text-purple-600">
                    {item.price?.toLocaleString()} {item.currency}
                  </p>
                </div>

                {/* İşlemler */}
                <div className="flex items-center gap-2 pr-4">
                  <Link
                    href={`/listing/${item.id}`}
                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-2xl transition-all border border-transparent hover:border-blue-100"
                  >
                    <ExternalLink size={20} />
                  </Link>
                  <button className="p-3 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-2xl transition-all border border-transparent hover:border-purple-100">
                    <Link
                      href={`/edit-listing/${item.id}`}
                      className="p-3 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-2xl transition-all border border-transparent hover:border-purple-100"
                    >
                      <Edit3 size={20} />
                    </Link>
                  </button>
                  <DeleteListingBtn id={item.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="py-40 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[4rem] bg-white dark:bg-slate-900/30">
              <PackageOpen size={64} className="mx-auto text-slate-200 mb-6" />
              <p className="text-slate-400 font-bold uppercase tracking-widest">
                {t('noListings')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
