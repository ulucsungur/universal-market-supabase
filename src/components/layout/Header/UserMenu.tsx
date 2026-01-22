'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Link as LocalizedLink } from '@/i18n/routing'
import {
  LogOut,
  User as UserIcon,
  ShieldCheck,
  PackageOpen,
  Heart,
  Package,
  BadgeDollarSign,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl' // i18n için ekledik
import { usePathname } from 'next/navigation'

export const UserMenu = ({ user }: { user: any }) => {
  const t = useTranslations('Common') // Çevirileri bağladık
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  const isAdmin =
    user?.role?.toLowerCase() === 'admin' ||
    (Array.isArray(user?.roles) && user.roles.includes('admin'))
  console.log('Kullanıcı Rolü:', user?.role)

  const [unreadCount, setUnreadCount] = useState(0)

  // BAĞIMLILIK DİZİSİNİ SABİTLİYORUZ
  useEffect(() => {
    // 1. Kullanıcı ID'si yoksa hiçbir şey yapma
    if (!user?.id) return

    // 3. API'den veriyi çek
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(
          `/api/messages?where[to][equals]=${user.id}&where[isRead][equals]=false&limit=1`,
        )
        const data = await res.json()
        setUnreadCount(data.totalDocs || 0)
      } catch (err) {
        console.error('Mesaj sayısı alınamadı:', err)
      }
    }

    fetchUnreadCount()

    // Bağımlılık dizisi her zaman 2 elemanlı: [ID, PATHNAME]
    // Bu ikisi değişse bile dizi boyutu hep 2 kalacağı için React hata vermez.
  }, [user?.id, pathname])

  const hasNotification = unreadCount > 0

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-100 dark:bg-neutral-800 p-1.5 pr-3 rounded-full border border-slate-200 dark:border-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-all"
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full border border-blue-600/20"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-blue-600/20">
            {userInitial}
          </div>
        )}
        {hasNotification && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#020617] rounded-full z-10 animate-pulse"></span>
        )}
        <span className="hidden sm:block text-[12px] font-bold text-slate-700 dark:text-neutral-200 max-w-[100px] truncate">
          {user?.name}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-neutral-900 ...">
            {/* ADMIN PANELİ LİNKİ - i18n linki DEĞİL, normal link olmalı */}
            {isAdmin && (
              <Link
                href="/admin"
                prefetch={false} // Payload admin için prefetch kapatmak daha sağlıklıdır
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-amber-600 bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors border-b border-slate-100 dark:border-neutral-800"
              >
                <ShieldCheck size={18} className="text-amber-600" />
                {t('adminPanel')}
              </Link>
            )}
            <LocalizedLink
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-purple-600 bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors border-b border-slate-100 dark:border-neutral-800"
            >
              <LayoutDashboard size={18} />
              Panelim (Dashboard)
            </LocalizedLink>

            <Link
              href="/my-listings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <PackageOpen size={18} /> {t('myListings')}
            </Link>
            <LocalizedLink
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Package size={18} className="text-blue-500" /> {t('myOrders')}
            </LocalizedLink>
            <LocalizedLink
              href="/sales"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <BadgeDollarSign size={18} className="text-blue-500" /> {t('Sales')}
            </LocalizedLink>

            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <UserIcon size={18} /> {t('profile')}
            </Link>
            <LocalizedLink
              href="/messages"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={18} /> {t('messages')}
              </div>
              {/* MESAJ SAYISI ROZETİ */}
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce">
                  {unreadCount}
                </span>
              )}
            </LocalizedLink>
            <LocalizedLink
              href="/favorites"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Heart size={18} className="text-red-500" /> Favorilerim
            </LocalizedLink>

            <button
              onClick={() => {
                setIsOpen(false)
                signOut()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-1 border-t border-slate-100 dark:border-neutral-800"
            >
              <LogOut size={18} /> {t('logout')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
