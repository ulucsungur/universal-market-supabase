import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Calendar, User, ArrowRight } from 'lucide-react'

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('Blog')
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    locale: locale as any,
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <header className="mb-16 text-center space-y-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            {t('title')}
          </h1>
          <div className="h-1.5 w-24 bg-purple-600 mx-auto rounded-full" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {posts.docs.map((post: any) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.featuredImage.url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-black text-purple-600 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> {new Date(post.publishedDate).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-purple-600 flex items-center gap-2">
                    {t('readMore')} <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.docs.length === 0 && (
          <div className="py-40 text-center opacity-50 font-bold uppercase tracking-widest">
            {t('noPosts')}
          </div>
        )}
      </div>
    </div>
  )
}
