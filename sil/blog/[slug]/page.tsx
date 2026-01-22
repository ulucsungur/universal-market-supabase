import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react'
import React from 'react'
import { Metadata } from 'next'
import { CommentSection } from '@/components/blog/CommentSection'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    locale: locale as any,
    where: { slug: { equals: slug } },
  })

  const post = result.docs[0]

  // Eğer yazı yoksa liste sayfası başlığına düşmemesi için kontrol
  if (!post) return { title: 'Yazı Bulunamadı' }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      images: (post.featuredImage as any)?.url ? [{ url: (post.featuredImage as any).url }] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('Blog')

  // 1. Yazıyı Slug ve Dile göre çekiyoruz
  const result = await payload.find({
    collection: 'posts',
    locale: locale as any,
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    depth: 2,
  })

  const post = result.docs[0]
  if (!post) return notFound()

  // 2. Yan tarafta gösterilecek "Diğer Yazılar"ı çekelim
  const otherPosts = await payload.find({
    collection: 'posts',
    locale: locale as any,
    where: { slug: { not_equals: slug }, status: { equals: 'published' } },
    limit: 3,
    sort: '-publishedDate',
  })
  // 3. Yorumları çekiyoruz
  const commentsRes = await payload.find({
    collection: 'comments',
    where: {
      and: [{ post: { equals: post.id } }, { status: { equals: 'approved' } }],
    },
    depth: 1,
    sort: '-createdAt',
  })
  return (
    <article className="min-h-screen bg-background transition-colors duration-500 pb-32">
      {/* --- HERO: Makale Kapak ve Başlık --- */}
      <header className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src={(post.featuredImage as any).url}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        {/* Amazon stili derin karartma katmanı */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-[1400px] mx-auto px-6 w-full pb-12 space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-xl"
            >
              <ArrowLeft size={14} /> {t('backToBlog')}
            </Link>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-[0.9] max-w-5xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5">
                <Calendar size={14} className="text-purple-600" />
                {new Date(post.publishedDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-purple-600" />
                {(post.author as any).name}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-purple-600" />5 Dakika Okuma
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- İÇERİK ALANI --- */}
      <div className="max-w-[1400px] mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* SOL: Ana Metin */}
          <main className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-8 md:p-16 border border-slate-200 dark:border-white/5 shadow-sm">
              {/* Lexical RichText Render */}
              <div
                className="prose prose-slate dark:prose-invert prose-xl max-w-none 
                prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
                prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400
                prose-a:text-purple-600 prose-img:rounded-[2rem] prose-img:shadow-2xl"
              >
                <RichText data={post.content} />
              </div>
            </div>
            {/* Yorum Bölümü */}
            <CommentSection postId={Number(post.id)} comments={commentsRes.docs} />
          </main>

          {/* SAĞ: Sidebar / Diğer Yazılar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="sticky top-32 space-y-10">
              {/* Sosyal Paylaşım */}
              <div className="p-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest opacity-80">
                    Bu Yazıyı Paylaş
                  </h3>
                  <div className="flex gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                      <Share2 size={20} />
                    </button>
                    {/* Buraya Twitter, FB ikonları gelebilir */}
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
              </div>

              {/* Son Yazılar Listesi */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 border-l-4 border-purple-600 pl-4">
                  {t('latestPosts')}
                </h3>
                <div className="space-y-6">
                  {otherPosts.docs.map((other: any) => (
                    <Link
                      key={other.id}
                      href={`/blog/${other.slug}`}
                      className="group flex items-center gap-4 transition-all"
                    >
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image
                          src={other.featuredImage.url}
                          alt=""
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {other.title}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(other.publishedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
