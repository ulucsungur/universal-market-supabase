import { auth } from '@/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { MessageList } from '@/components/messages/MessageList'

export default async function MessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  const t = await getTranslations('Messages')

  if (!session?.user) redirect(`/${locale}/login`)

  const payload = await getPayload({ config: configPromise })
  const userId = Number(session.user.id)

  const messagesRes = await payload.find({
    collection: 'messages',
    locale: locale as any,
    where: {
      or: [{ from: { equals: userId } }, { to: { equals: userId } }],
    },
    sort: '-createdAt',
    depth: 2,
  })

  // Payload verilerini Next.js 15'in sevdiği saf JSON formatına çevirelim
  const initialMessages = JSON.parse(JSON.stringify(messagesRes.docs))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors">
      <div className="max-w-[1100px] mx-auto px-6">
        <header className="mb-16 space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
            {t('title')}
          </h1>
          <div className="h-1.5 w-20 bg-purple-600 rounded-full" />
        </header>

        {initialMessages.length > 0 ? (
          <MessageList initialMessages={initialMessages} userId={userId} />
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[4rem]">
            <p className="text-slate-400 font-black uppercase tracking-[0.2em]">
              {t('noMessages')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
