'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { Loader2, Camera, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { updateProfileAction } from '@/lib/actions/user'

export const ProfileForm = ({ user, locale }: { user: any; locale: string }) => {
  const t = useTranslations('Profile')
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState(user?.image || '')

  const [phone, setPhone] = useState(user?.phone || '')
  const [instagram, setInstagram] = useState(user?.instagram || '')
  const [facebook, setFacebook] = useState(user?.facebook || '')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Resim yükleme kısmı aynı kalabilir (Media API genellikle create: true ile çalışır)
      let avatarUrl = user?.image
      if (file) {
        const formDataMedia = new FormData()
        formDataMedia.append('file', file)
        formDataMedia.append('alt', name)
        const mediaRes = await fetch('/api/media', { method: 'POST', body: formDataMedia })
        const mediaData = await mediaRes.json()
        avatarUrl = mediaData.doc.id
      }

      // 2. FETCH YERİNE SERVER ACTION KULLANIYORUZ
      const result = await updateProfileAction({
        name: name,
        image: avatarUrl,
        phone,
        instagram,
        facebook,
      })

      if (result.success) {
        alert(t('success'))
        router.refresh()
      } else {
        alert(result.error)
      }
    } catch (err) {
      alert(t('error'))
    } finally {
      setLoading(false)
    }
  }

  const inputStyle =
    'w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-slate-900 dark:text-white outline-none focus:border-purple-500 font-medium transition-all'

  return (
    <form onSubmit={handleSave} className="space-y-10">
      {/* AVATAR YÜKLEME */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-slate-100">
            {preview ? (
              <Image src={preview} alt="Avatar" fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-4xl uppercase">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2.5 bg-purple-600 text-white rounded-xl cursor-pointer hover:bg-purple-700 shadow-xl transition-all hover:scale-110">
            <Camera size={18} />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {t('avatarLabel')}
        </p>
      </div>

      <div className="space-y-6">
        {/* İSİM */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
            {t('nameLabel')}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyle}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">TELEFON</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputStyle}
            placeholder="+90 532 123 45 67"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">INSTAGRAM</label>
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className={inputStyle}
              placeholder="kullaniciadi"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">FACEBOOK</label>
            <input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className={inputStyle}
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>

        {/* E-POSTA (Read Only) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
            {t('emailLabel')}
          </label>
          <input
            value={user?.email}
            disabled
            className={inputStyle + ' opacity-50 cursor-not-allowed'}
          />
        </div>

        {/* ROL (Read Only) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
            {t('roleLabel')}
          </label>
          <div className="px-6 py-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-500/20 rounded-2xl text-purple-600 font-bold text-xs uppercase tracking-widest">
            {user?.role}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white transition-all shadow-xl disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t('saveBtn')}
      </button>
    </form>
  )
}
