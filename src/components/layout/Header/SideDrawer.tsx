'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import {
  X,
  User,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Settings,
} from 'lucide-react';
//import { useSession } from 'next-auth/react'
import Image from 'next/image'; // 1. Image import edildi

export const SideDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const t = useTranslations('SideMenu');
  const locale = useLocale();
  //const { data: session } = useSession()
  const session: any = null;
  const [categories, setCategories] = useState<any[]>([]);
  const [activeParent, setActiveParent] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // ANA KATEGORİLER: Payload'dan dinamik gelir
  useEffect(() => {
    if (isOpen && !activeParent) {
      fetch(
        `/api/categories?locale=${locale}&where[parent][exists]=false&depth=0`,
      )
        .then((res) => res.json())
        .then((data) => setCategories(data.docs || []));
    }
  }, [isOpen, locale, activeParent]);

  // ALT KATEGORİLER: Tıklanan kategoriye göre dinamik gelir
  const handleCategoryClick = async (id: string, title: string) => {
    try {
      const res = await fetch(
        `/api/categories?locale=${locale}&where[parent][equals]=${id}&depth=0`,
      );
      const data = await res.json();

      if (data.docs && data.docs.length > 0) {
        setSubCategories(data.docs);
        setActiveParent({ id, title });
      }
    } catch (err) {
      console.error('Alt kategoriler çekilemedi:', err);
    }
  };

  const handleBack = () => {
    setActiveParent(null);
    setSubCategories([]);
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/60 z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* PANEL */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] md:w-[360px] bg-white dark:bg-slate-950 z-[210] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* HEADER */}
        <div className="bg-slate-900 dark:bg-black text-white p-6 flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-white/10">
            {session?.user?.image ? (
              // 2. <img> yerine <Image /> kullanıldı
              <Image
                src={session.user.image}
                alt="User Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <User size={24} />
            )}
          </div>
          <span className="font-black text-sm uppercase tracking-tight truncate max-w-[180px]">
            {session?.user
              ? t('greetingUser', { name: session.user.name ?? 'User' })
              : t('greeting')}
          </span>
          <button
            onClick={onClose}
            className="ml-auto hover:rotate-90 transition-transform"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="overflow-hidden h-[calc(100%-88px)] relative">
          {/* ALT MENÜ TABAKASI (Slide-in) */}
          <div
            className={`absolute inset-0 bg-white dark:bg-slate-950 z-20 transition-transform duration-300 ease-in-out ${activeParent ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <button
              onClick={handleBack}
              className="w-full flex items-center gap-4 px-8 py-5 border-b border-slate-100 dark:border-white/5 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-purple-600 transition-colors"
            >
              <ChevronLeft size={18} />
              {t('backToMenu') || 'Ana Menü'}
            </button>
            <div className="px-8 py-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">
                {activeParent?.title}
              </h3>
              <div className="space-y-1">
                {subCategories.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/${sub.slug}`}
                    onClick={onClose}
                    className="block py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-tight"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ANA MENÜ TABAKASI */}
          <div className="h-full overflow-y-auto py-4">
            {/* KATEGORİLER - DİNAMİK */}
            <div className="px-8 py-4 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                {t('shopByCategory')}
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id, cat.title)}
                    className="w-full flex items-center justify-between py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg px-2 -mx-2 transition-all group text-left"
                  >
                    {cat.title}
                    <ChevronRight
                      size={16}
                      className="text-slate-300 group-hover:text-purple-500 transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* DİĞER LİNKLER */}
            <div className="px-8 py-8 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                {t('programs')}
              </h3>
              <Link
                href="/blog"
                onClick={onClose}
                className="flex items-center gap-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600"
              >
                <BookOpen size={18} className="text-purple-500" />
                {t('blog')}
              </Link>
            </div>

            <div className="px-8 py-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                {t('helpSettings')}
              </h3>
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600"
              >
                <Settings size={18} />
                {t('myAccount')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// 'use client'

// import React, { useEffect, useState } from 'react'
// import { Link } from '@/i18n/routing'
// import { useTranslations, useLocale } from 'next-intl'
// import { X, User, ChevronRight, BookOpen, Settings } from 'lucide-react'
// import { useSession } from 'next-auth/react'

// export const SideDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//   const t = useTranslations('SideMenu')
//   const locale = useLocale()
//   const { data: session } = useSession()
//   const [categories, setCategories] = useState<any[]>([])

//   useEffect(() => {
//     if (isOpen) {
//       // Menü açıldığında kategorileri çek
//       fetch(`/api/categories?locale=${locale}&where[parent][exists]=false&depth=0`)
//         .then((res) => res.json())
//         .then((data) => setCategories(data.docs || []))
//     }
//   }, [isOpen, locale])

//   return (
//     <>
//       {/* KARARTMA ARKA PLAN (Overlay) */}
//       <div
//         className={`fixed inset-0 bg-black/60 z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
//         onClick={onClose}
//       />

//       {/* MENÜ PANELİ */}
//       <div
//         className={`fixed top-0 left-0 h-full w-[300px] md:w-[360px] bg-white dark:bg-slate-950 z-[210] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         {/* MENÜ ÜST KISMI (User Header) */}
//         <div className="bg-slate-900 dark:bg-black text-white p-6 flex items-center gap-4">
//           <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
//             <User size={24} />
//           </div>
//           <span className="font-black text-sm uppercase tracking-tight">
//             {session?.user
//               ? t('greetingUser', { name: session.user.name ?? 'User' }) // Burayı güncelledik
//               : t('greeting')}
//           </span>
//           <button onClick={onClose} className="ml-auto hover:rotate-90 transition-transform">
//             <X size={24} />
//           </button>
//         </div>

//         {/* MENÜ İÇERİĞİ (Scrollable) */}
//         <div className="overflow-y-auto h-[calc(100%-88px)] py-4 custom-scrollbar">
//           {/* KATEGORİLER */}
//           <div className="px-8 py-4 border-b border-slate-100 dark:border-white/5">
//             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
//               {t('shopByCategory')}
//             </h3>
//             <div className="space-y-1">
//               {categories.map((cat) => (
//                 <Link
//                   key={cat.id}
//                   href={`/${cat.slug}`}
//                   onClick={onClose}
//                   className="flex items-center justify-between py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg px-2 -mx-2 transition-all group"
//                 >
//                   {cat.title}
//                   <ChevronRight size={16} className="text-slate-300 group-hover:text-purple-500" />
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* PROGRAMLAR VE ÖZELLİKLER */}
//           <div className="px-8 py-8 border-b border-slate-100 dark:border-white/5">
//             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
//               {t('programs')}
//             </h3>
//             <Link
//               href="/blog"
//               onClick={onClose}
//               className="flex items-center gap-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-all"
//             >
//               <BookOpen size={18} className="text-purple-500" />
//               {t('blog')}
//             </Link>
//           </div>

//           {/* YARDIM VE AYARLAR */}
//           <div className="px-8 py-8">
//             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
//               {t('helpSettings')}
//             </h3>
//             <Link
//               href="/profile"
//               onClick={onClose}
//               className="flex items-center gap-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-all"
//             >
//               <Settings size={18} className="text-slate-400" />
//               {t('myAccount')}
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
