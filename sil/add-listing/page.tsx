import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AddListingForm } from '@/components/forms/AddListingForm'
import { setRequestLocale } from 'next-intl/server'

export default async function AddListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await auth()
  const t = await getTranslations('PostAd')

  // YETKİ KONTROLÜ
  const isAuthorized = session?.user?.role === 'admin' || session?.user?.role === 'agent'

  if (!isAuthorized) {
    // Yetkisi yoksa ana sayfaya (dil koruyarak) yönlendir
    redirect(`/${locale}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12 space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
            {t('title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            İlanınızı oluşturun ve binlerce alıcıya hemen ulaşın.
          </p>
        </header>

        {/* Form Bileşeni (Bir sonraki adımda oluşturacağız) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-purple-500/5">
          <AddListingForm locale={locale} />
        </div>
      </div>
    </div>
  )
}
