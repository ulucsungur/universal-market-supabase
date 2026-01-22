import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { AddListingForm } from '@/components/forms/AddListingForm' // 👈 Add formunu çağırıyoruz

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  setRequestLocale(locale)

  const session = await auth()
  if (!session?.user) redirect(`/${locale}/login`)

  const payload = await getPayload({ config: configPromise })

  // Mevcut ilanı tüm detaylarıyla (depth: 1) çek
  const listing = await payload.findByID({
    collection: 'listings',
    id: id,
    locale: 'all' as any,
    depth: 1,
  })

  if (!listing) return notFound()

  // Yetki Kontrolü
  const isOwner =
    Number(listing.author) === Number(session.user.id) ||
    Number((listing.author as any)?.id) === Number(session.user.id)
  const isAdmin = session.user.role === 'admin'

  if (!isOwner && !isAdmin) redirect(`/${locale}/my-listings`)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12 space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
            İLANI DÜZENLE
          </h1>
          <p className="text-slate-500 font-medium">
            #{listing.id} numaralı ilanı güncelliyorsunuz.
          </p>
        </header>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-xl">
          {/* SİHİRLİ DOKUNUŞ: initialData propunu gönderiyoruz */}
          <AddListingForm locale={locale} initialData={listing} />
        </div>
      </div>
    </div>
  )
}
