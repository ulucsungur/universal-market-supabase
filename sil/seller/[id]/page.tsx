import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { ListingCard } from '@/components/ui/ListingCard'
import { User, ShieldCheck, MapPin, Package } from 'lucide-react'
import Image from 'next/image'

export default async function SellerPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const payload = await getPayload({ config: configPromise })

  // 1. Satıcı Bilgilerini Çek
  const seller: any = await payload.findByID({
    collection: 'users',
    id: id,
    depth: 1,
  })

  if (!seller) return notFound()

  // 2. Bu Satıcıya Ait İlanları Çek
  const listings = await payload.find({
    collection: 'listings',
    locale: locale as any,
    where: {
      author: { equals: id },
    },
    sort: '-createdAt',
  })
  const avatarUrl =
    seller.image && typeof seller.image === 'object' ? (seller.image as any).url : null
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* SATICI PROFİL BAŞLIĞI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[4rem] p-12 mb-20 shadow-xl flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-40 h-40 rounded-[3rem] overflow-hidden bg-purple-600/10 border-4 border-white dark:border-slate-800 shadow-2xl">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={seller.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-purple-600 font-black text-6xl">
                {seller.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 text-[10px] font-black tracking-widest uppercase">
              <ShieldCheck size={14} /> Onaylı Kurumsal Üye
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {seller.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-2 border-r border-slate-200 dark:border-white/10 pr-6">
                <Package size={16} className="text-purple-600" /> {listings.totalDocs} İlan
                Yayınlıyor
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-purple-600" /> İstanbul, Türkiye
              </span>
            </div>
          </div>
        </div>

        {/* SATICININ İLANLARI */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white italic">
              Tüm İlanları
            </h2>
            <div className="h-1 flex-1 bg-slate-100 dark:bg-white/5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {listings.docs.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>

          {listings.docs.length === 0 && (
            <div className="py-32 text-center opacity-30 font-black uppercase tracking-widest">
              Bu satıcının henüz aktif ilanı bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
