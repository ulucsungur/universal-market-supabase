'use client'

import React, { useState } from 'react'
import { Check, Trash2, MessageSquare, Loader2, User } from 'lucide-react'
import { manageCommentAction } from '@/lib/actions/comment-admin'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export const AdminCommentManager = ({ comments }: { comments: any[] }) => {
  const t = useTranslations('Dashboard.admin')
  const router = useRouter()
  const [processingId, setProcessingId] = useState<number | null>(null)

  const handleAction = async (id: number, action: 'approve' | 'delete') => {
    setProcessingId(id)
    const res = await manageCommentAction(id, action)
    if (res.success) {
      router.refresh() // Veriyi anında güncelle
    } else {
      alert(res.error)
    }
    setProcessingId(null)
  }

  if (comments.length === 0)
    return (
      <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] opacity-50">
        <p className="text-xs font-bold uppercase tracking-widest">{t('noPendingComments')}</p>
      </div>
    )

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-tighter text-purple-600 flex items-center gap-3">
        <MessageSquare size={20} /> {t('pendingComments')} ({comments.length})
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 text-slate-400">
                <User size={20} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs uppercase text-slate-900 dark:text-white">
                    {comment.user?.name}
                  </span>
                  <span className="text-[9px] font-bold text-purple-500 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded uppercase">
                    {comment.post?.title}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  {comment.content}
                </p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleAction(comment.id, 'approve')}
                disabled={processingId === comment.id}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {processingId === comment.id ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Check size={14} />
                )}
                {t('approval')}
              </button>
              <button
                onClick={() => handleAction(comment.id, 'delete')}
                disabled={processingId === comment.id}
                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
