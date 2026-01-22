'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { addCommentAction } from '@/lib/actions/comment'
import { MessageSquare, Loader2, User } from 'lucide-react'

export const CommentSection = ({ postId, comments }: { postId: number; comments: any[] }) => {
  const t = useTranslations('Blog')
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await addCommentAction(postId, content)
    if (res.success) {
      setContent('')
      setMessage(t('commentSuccess'))
    }
    setLoading(false)
  }

  return (
    <div className="mt-20 space-y-12">
      <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
        <MessageSquare className="text-purple-600" /> {t('comments')} ({comments.length})
      </h3>

      {/* YORUM LİSTESİ */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem]"
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 flex-shrink-0">
              <User size={20} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase">{comment.user.name}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* YORUM FORMU */}
      {session ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 pt-8 border-t border-slate-100 dark:border-white/5"
        >
          {message && <p className="text-green-600 text-xs font-bold uppercase">{message}</p>}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('commentPlaceholder')}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 text-sm outline-none focus:border-purple-500 transition-all min-h-[150px]"
            required
          />
          <button
            disabled={loading}
            className="px-10 py-4 bg-purple-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 shadow-xl shadow-purple-600/20 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : t('sendComment')}
          </button>
        </form>
      ) : (
        <div className="p-10 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/5">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
            {t('mustLogin')}
          </p>
        </div>
      )}
    </div>
  )
}
