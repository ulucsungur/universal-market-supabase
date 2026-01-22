'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function manageCommentAction(commentId: number, action: 'approve' | 'delete') {
  const session = await auth()

  // Sadece adminler bu işlemi yapabilir
  if (session?.user?.role !== 'admin') {
    return { error: 'Bu işlem için yetkiniz yok.' }
  }

  const payload = await getPayload({ config: configPromise })

  try {
    if (action === 'approve') {
      await payload.update({
        collection: 'comments',
        id: commentId,
        data: { status: 'approved' },
      })
    } else if (action === 'delete') {
      await payload.delete({
        collection: 'comments',
        id: commentId,
      })
    }

    revalidatePath('/dashboard')
    revalidatePath('/blog')
    return { success: true }
  } catch (error) {
    return { error: 'İşlem başarısız oldu.' }
  }
}
