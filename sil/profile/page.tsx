import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { ProfileForm } from '@/components/forms/ProfileForm'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await auth()
  if (!session?.user) redirect(`/${locale}/login`)

  const payload = await getPayload({ config: configPromise })

  try {
    // Veritabanından en güncel bilgileri çekiyoruz
    const currentUser = await payload.findByID({
      collection: 'users',
      id: session.user.id,
    })

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors">
        <div className="max-w-2xl mx-auto px-6">
          <header className="mb-12 text-center text-foreground font-black uppercase">
            <h1 className="text-5xl tracking-tighter">HESAP AYARLARI</h1>
            <p className="text-slate-500 mt-4 text-[10px] tracking-[0.2em]">
              Kişisel bilgilerinizi buradan yönetin
            </p>
          </header>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl">
            <ProfileForm user={currentUser} locale={locale} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    // EĞER KULLANICI HENÜZ VERİTABANINDA OLUŞMADIYSA ÇÖKMESİN, ANA SAYFAYA ATSIN
    console.error('Kullanıcı veritabanında bulunamadı, yönlendiriliyor...')
    redirect(`/${locale}`)
  }
}
