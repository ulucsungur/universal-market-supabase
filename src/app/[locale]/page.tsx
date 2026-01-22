'use client';
import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase'; // Yeni oluşturduğumuz dosya
import { HeroSlider } from '@/components/ui/HeroSlider';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { PickedForYou } from '@/components/ui/PickedForYou';

export default function Page() {
  const locale = useLocale();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*');

      console.log('Supabase Verisi:', data); // F12 Konsolunda bunu görmeliyiz
      console.log('Supabase Hatası:', error);

      if (data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      <HeroSlider />
      <section className="max-w-[1400px] mx-auto px-6 -mt-16 md:-mt-32 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-center col-span-4 py-10 opacity-50 text-white">
              Yükleniyor...
            </p>
          ) : categories.length > 0 ? (
            categories.map((cat: any) => {
              // Eğer URL tırnakla başlıyorsa onları temizle (güvenlik önlemi)
              const cleanImageUrl = cat.image_url?.replace(/^"|"$/g, '');

              return (
                <CategoryCard
                  key={cat.id}
                  title={cat.title}
                  slug={cat.slug}
                  image={cleanImageUrl}
                />
              );
            })
          ) : (
            <p className="text-center col-span-4 py-10 opacity-50 text-white">
              Henüz kategori eklenmemiş.
            </p>
          )}
        </div>
      </section>
      <PickedForYou />
    </div>
  );
}
