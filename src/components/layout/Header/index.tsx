'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { UserMenu } from './UserMenu';
import { SubHeader } from './SubHeader'; // Yeni bileşen
import { PlusCircle, Search } from 'lucide-react';
//import { useSession } from 'next-auth/react'
import { SearchBar } from './SearchBar';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { useCart } from '@/providers/Cart'; // 1. Sepet hook'unu ekle
import { ShoppingCart } from 'lucide-react';

export const Header = () => {
  const { cartCount } = useCart();
  const commonT = useTranslations('Common');
  //const { data: session } = useSession()
  const session: any = null;
  const user = session?.user;
  const isAuthorized = user?.role === 'admin' || user?.role === 'agent';
  return (
    <>
      <header className="sticky top-0 z-[100] w-full border-b border-slate-200 dark:border-white/5 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors duration-500">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between gap-10">
          {/* 1. LOGO */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
              UNIVERSAL<span className="text-purple-600">MARKET</span>
            </span>
          </Link>

          {/* 2. ORTA KISIM: ARAMA ÇUBUĞU (Amazon Stil) */}
          <div className="hidden md:flex flex-1 max-w-2xl relative group">
            <div className="hidden md:flex flex-1 max-w-2xl">
              <SearchBar />
            </div>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all">
              <Search size={18} />
            </button>
          </div>

          {/* 3. SAĞ TARAF: ARAÇLAR */}
          <div className="flex items-center gap-4">
            {/* SEPET İKONU */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all group"
            >
              <ShoppingCart
                size={22}
                className="text-slate-600 dark:text-slate-300 group-hover:text-purple-600"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#020617] animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2">
              <CurrencySwitcher />
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                href="/login"
                className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-purple-600 transition-colors"
              >
                {commonT('login')}
              </Link>
            )}
            {isAuthorized && (
              <Link
                href="/add-listing"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <PlusCircle size={16} />
                {commonT('postAd')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* AMAZON STİL ALT BAR */}
      <SubHeader />
    </>
  );
};
