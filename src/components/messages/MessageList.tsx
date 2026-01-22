'use client'

import React, { useEffect, useState } from 'react'
import { Link } from '@/i18n/routing'
import { Mail, ArrowUpRight, User } from 'lucide-react'
import { markAllMessagesAsReadAction } from '@/lib/actions/message'
import { useTranslations } from 'next-intl'

export const MessageList = ({
  initialMessages,
  userId,
}: {
  initialMessages: any[]
  userId: number
}) => {
  // Hook'u burada kullanıyoruz (Props olarak gelmesine gerek yok)
  const t = useTranslations('Messages')
  const [messages, setMessages] = useState(initialMessages)

  useEffect(() => {
    // 3 saniye sonra mesajları veritabanında "okundu" yap ve UI'ı güncelle
    const timer = setTimeout(async () => {
      await markAllMessagesAsReadAction()
      setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })))
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {messages.map((msg: any) => {
        const isIncoming = Number(msg.to?.id || msg.to) === userId
        const isUnread = isIncoming && msg.isRead === false
        const otherUser = isIncoming ? msg.from : msg.to

        return (
          <div
            key={msg.id}
            className={`bg-white dark:bg-slate-900 border p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 transition-all duration-700 relative overflow-hidden ${
              isUnread
                ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-xl'
                : 'border-slate-200 dark:border-white/5 shadow-sm'
            }`}
          >
            {/* Sol Çizgi */}
            <div
              className={`absolute top-0 left-0 w-1.5 h-full ${isIncoming ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            />

            {/* Yeni Mesaj Etiketi */}
            {isUnread && (
              <div className="absolute top-6 right-8 flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/20">
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
                  YENİ MESAJ
                </span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              </div>
            )}

            {/* Gönderen/Alıcı */}
            <div className="md:w-1/4 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isIncoming ? (
                  <>
                    <Mail size={12} className="text-blue-500" /> {t('from')}
                  </>
                ) : (
                  <>
                    <ArrowUpRight size={12} /> {t('to')}
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
                <span
                  className={`uppercase text-sm ${isUnread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-600 dark:text-slate-400'}`}
                >
                  {otherUser?.name || 'Kullanıcı'}
                </span>
              </div>
            </div>

            {/* İçerik */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md uppercase">
                  {t('listing')}: {msg.listing?.title}
                </span>
              </div>
              <p
                className={`text-sm leading-relaxed ${isUnread ? 'text-slate-900 dark:text-white font-medium italic' : 'text-slate-600 dark:text-slate-400 italic opacity-70'}`}
              >
                {msg.content}
              </p>
            </div>

            {/* Buton */}
            <div className="flex items-center">
              <Link
                href={`/listing/${msg.listing?.id}`}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg"
              >
                {t('viewListing')}
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
