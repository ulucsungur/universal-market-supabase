'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// Lexical (RichText) yapısını hatasız oluşturan yardımcı fonksiyon
const buildLexicalStructure = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [{ text: text || '', type: 'text', version: 1 }],
      },
    ],
  },
})

export async function saveListingAction(postData: any, id?: string | number) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Oturum kapalı.' }

  const payload = await getPayload({ config: configPromise })
  const userId = Number(session.user.id)

  try {
    if (id) {
      // --- GÜNCELLEME (İKİ AŞAMALI) ---
      // 1. Türkçe güncelle
      await payload.update({
        collection: 'listings',
        id: Number(id),
        locale: 'tr',
        data: {
          ...postData,
          title: postData.title.tr,
          description: buildLexicalStructure(postData.description_tr),
          author: userId,
        },
      })

      // 2. İngilizce güncelle
      await payload.update({
        collection: 'listings',
        id: Number(id),
        locale: 'en',
        data: {
          ...postData,
          title: postData.title.en,
          description: buildLexicalStructure(postData.description_en),
          author: userId,
        },
      })
    } else {
      // --- YENİ KAYIT ---
      await payload.create({
        collection: 'listings',
        data: {
          ...postData,
          title: { tr: postData.title.tr, en: postData.title.en },
          description: {
            tr: buildLexicalStructure(postData.description_tr),
            en: buildLexicalStructure(postData.description_en),
          },
          author: userId,
        },
        locale: 'all' as any,
      })
    }

    revalidatePath('/', 'layout')
    revalidatePath('/my-listings')
    return { success: true }
  } catch (error: any) {
    console.error('KRİTİK HATA:', error)
    return { error: error.message || 'İşlem başarısız.' }
  }
}
