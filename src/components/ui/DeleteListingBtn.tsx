'use client'

import React, { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export const DeleteListingBtn = ({ id }: { id: string | number }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const t = useTranslations('Dashboard')

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm'))) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        // Sayfayı yenilemek yerine router.refresh() ile veriyi tazeleyelim
        router.refresh()
      } else {
        alert('Silme işlemi başarısız oldu.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/20 disabled:opacity-50"
    >
      {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
    </button>
  )
}
