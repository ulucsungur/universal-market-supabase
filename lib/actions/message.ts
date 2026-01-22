'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function sendMessageAction(data: {
  to: number | string
  listing: number | string
  content: string
}) {
  console.log('1. Server Action tetiklendi. Veri:', data)

  const session = await auth()
  const userId = session?.user?.id
  console.log('2. Oturum durumu:', userId ? `Giriş yapıldı (ID: ${userId})` : 'Giriş yapılmadı')

  if (!userId) {
    return { error: 'Giriş yapmalısınız.' }
  }

  const payload = await getPayload({ config: configPromise })

  try {
    console.log("3. Payload'a kayıt isteği gönderiliyor...")

    // Postgres için ID'leri sayıya zorluyoruz
    const newMessage = await payload.create({
      collection: 'messages',
      data: {
        from: Number(userId),
        to: Number(data.to),
        listing: Number(data.listing),
        content: data.content,
        isRead: false,
      },
    })

    console.log('4. Kayıt BAŞARILI! Mesaj ID:', newMessage.id)
    return { success: true }
  } catch (error: any) {
    console.error('--- ❌ KAYIT SIRASINDA HATA OLUŞTU ---')
    // Hatanın tüm detaylarını terminale döküyoruz
    console.error(JSON.stringify(error, null, 2))

    return { error: error.message || 'Veritabanı hatası.' }
  }
}
export async function markAllMessagesAsReadAction() {
  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : null

  if (!userId) return { error: 'Yetkisiz erişim' }

  const payload = await getPayload({ config: configPromise })

  try {
    // Kullanıcıya gelen ve henüz okunmamış olan tüm mesajları bul ve güncelle
    await payload.update({
      collection: 'messages',
      where: {
        and: [{ to: { equals: userId } }, { isRead: { equals: false } }],
      },
      data: {
        isRead: true,
      },
    })

    revalidatePath('/') // Navbar'daki sayacın güncellenmesi için
    return { success: true }
  } catch (error) {
    return { error: 'Mesajlar güncellenemedi' }
  }
}
