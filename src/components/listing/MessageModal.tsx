'use client'

import React, { useState } from 'react'
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { sendMessageAction } from '@/lib/actions/message'

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  sellerId: number
  listingId: number
  listingTitle: string
}

export const MessageModal = ({
  isOpen,
  onClose,
  sellerId,
  listingId,
  listingTitle,
}: MessageModalProps) => {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await sendMessageAction({
        to: sellerId,
        listing: listingId,
        content: content,
      })
      console.log('Sunucudan gelen yanıt:', res)

      if (res.success) {
        setStatus('success')
        setTimeout(() => {
          onClose()
          setStatus('idle')
          setContent('')
        }, 2000)
      } else {
        setStatus('error')
        setStatus('error')
        alert('Hata: ' + (res.error || 'Bilinmeyen bir sorun oluştu.'))
      }
    } catch (err) {
      console.error('Bağlantı hatası:', err)
      setStatus('error')
      alert('Sunucuyla bağlantı kurulamadı.')
    }
  }
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      {/* Arka Plan Karartma */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
              Mesaj Gönder
            </h3>
            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest truncate max-w-[250px]">
              {listingTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {status === 'success' ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in">
              <CheckCircle2 size={48} className="mx-auto text-green-500" />
              <p className="font-black uppercase text-xs tracking-widest text-slate-900 dark:text-white">
                Mesajınız İletildi!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Mesajınız
                </label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="İlan hakkında sormak istediklerinizi yazın..."
                  className="w-full h-40 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 text-sm outline-none focus:border-purple-500 transition-all resize-none"
                />
              </div>

              <button
                disabled={status === 'loading' || !content.trim()}
                className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> GÖNDER
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
