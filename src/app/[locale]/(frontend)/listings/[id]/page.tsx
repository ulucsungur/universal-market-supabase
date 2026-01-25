import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ListingDetailClient } from '@/components/listing/ListingDetailClient';

export const revalidate = 0;

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: listing } = await supabase
    .from('listings')
    .select('title')
    .eq('id', id)
    .single();
  return { title: listing?.title || 'İlan Detayı' };
}

export default async function ListingDetailPage({ params }: Props) {
  // 1. ADIM: Params'ı mutlaka await ile bekle (Next.js 15 kuralı)
  const { id, locale } = await params;
  setRequestLocale(locale);

  // 2. ADIM: Supabase sorgusunu yaparken title_en'i de eklediğinden emin ol
  const { data: listing, error } = await supabase
    .from('listings')
    .select(
      `
      *,
      categories (
        id,
        title,
        title_en,
        slug
      )
    `,
    )
    .eq('id', id)
    .single();

  // Konsolda hatayı görmek için (Hata varsa 404'e düşme nedenini anlarız)
  if (error) {
    console.error('Supabase Detay Hatası:', error.message);
    return notFound();
  }

  if (!listing) return notFound();

  return <ListingDetailClient listing={listing} isInitialBookmarked={false} />;
}
