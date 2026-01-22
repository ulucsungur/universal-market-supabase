'use client'

import React, { useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { toggleBookmarkAction } from '@/lib/actions/bookmark'
import { useSession } from 'next-auth/react'

export const BookmarkBtn = ({
  listingId,
  isInitialBookmarked,
}: {
  listingId: number
  isInitialBookmarked: boolean
}) => {
  const { data: session } = useSession()
  const [isBookmarked, setIsBookmarked] = useState(isInitialBookmarked)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (!session) {
      alert('Lütfen giriş yapın')
      return
    }
    setLoading(true)
    const res = await toggleBookmarkAction(listingId)
    if (res.success) setIsBookmarked(res.isBookmarked!)
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-3 rounded-2xl transition-all border ${isBookmarked ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:text-red-500'}`}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <Heart size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
      )}
    </button>
  )
}
