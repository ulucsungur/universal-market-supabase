'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, ChevronRight } from 'lucide-react';
import { SideDrawer } from './SideDrawer';

export const SubHeader = () => {
  const t = useTranslations('SubNavbar');
  const locale = useLocale();
  const [categories, setCategories] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setCategories([]);
  }, [locale]);

  return (
    <>
      <div className="w-full bg-slate-900 dark:bg-black text-white/90 border-b border-white/5 transition-colors duration-500">
        <div className="max-w-[1400px] mx-auto px-6 h-10 flex items-center gap-5 overflow-x-auto no-scrollbar">
          {/* Amazon Stil "Tümü" Butonu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            <Menu size={16} className="text-purple-500" />
            {t('all')}
          </button>

          <div className="h-4 w-px bg-white/10" />

          {/* Payload'dan Gelen Dinamik Kategoriler */}
          <nav className="flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all whitespace-nowrap flex items-center gap-1"
              >
                {cat.title}
              </Link>
            ))}
          </nav>

          {/* Sağ Tarafa Kayan Küçük Bir Bilgi / Slogan (Opsiyonel) */}
          <div className="ml-auto hidden lg:flex items-center gap-2 text-[9px] font-black text-purple-400 uppercase tracking-[0.2em] whitespace-nowrap">
            <span className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
            Premium Marketplace Experience
          </div>
        </div>
      </div>
      <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};
