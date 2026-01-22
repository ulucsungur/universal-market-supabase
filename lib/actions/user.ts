'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(formData: {
  name: string
  image?: string | number
  phone?: string
  instagram?: string
  facebook?: string
}) {
  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : null

  if (!userId) {
    return { error: 'Oturum açmanız gerekiyor.' }
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const updateData: any = {
      name: formData.name,
      phone: formData.phone,
      instagram: formData.instagram,
      facebook: formData.facebook,
    }

    // 3. Eğer resim ID'si gelmişse, onu da mutlaka sayıya çevirerek ekleyelim
    if (formData.image) {
      updateData.image = Number(formData.image)
    }

    await payload.update({
      collection: 'users',
      id: userId, // Artık bir number
      data: updateData,
    })

    revalidatePath('/') // Sayfayı yenilemek için
    return { success: true }
  } catch (error) {
    console.error('Profil güncelleme hatası:', error)
    return { error: 'Güncelleme başarısız oldu.' }
  }
}
