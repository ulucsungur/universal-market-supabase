'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function toggleBookmarkAction(listingId: number) {
  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : null

  if (!userId) return { error: 'Giriş yapmalısınız' }

  const payload = await getPayload({ config: configPromise })

  try {
    const user = await payload.findByID({ collection: 'users', id: userId })
    const currentBookmarks =
      (user.bookmarks as any[])?.map((b) => (typeof b === 'object' ? b.id : b)) || []

    let newBookmarks
    if (currentBookmarks.includes(listingId)) {
      newBookmarks = currentBookmarks.filter((id) => id !== listingId)
    } else {
      newBookmarks = [...currentBookmarks, listingId]
    }

    await payload.update({
      collection: 'users',
      id: userId,
      data: { bookmarks: newBookmarks },
    })

    revalidatePath('/')
    return { success: true, isBookmarked: !currentBookmarks.includes(listingId) }
  } catch (error) {
    return { error: 'İşlem başarısız' }
  }
}
