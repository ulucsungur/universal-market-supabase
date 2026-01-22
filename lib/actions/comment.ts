'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function addCommentAction(postId: number, content: string) {
  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : null

  if (!userId) return { error: 'Giriş yapmalısınız' }

  const payload = await getPayload({ config: configPromise })

  try {
    await payload.create({
      collection: 'comments',
      data: {
        user: userId,
        post: postId,
        content: content,
        status: 'pending', // Otomatik onay bekliyor durumuna düşer
      },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Yorum gönderilemedi' }
  }
}
