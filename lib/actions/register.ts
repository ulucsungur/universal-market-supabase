'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

// State tipini tanımlıyoruz
export type RegisterActionState = {
  error: string | null
  success: string | null
}

export async function registerUser(
  prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'Lütfen tüm alanları doldurun.', success: null }
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const { docs: existingUsers } = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })

    if (existingUsers.length > 0) {
      return { error: 'Bu e-posta adresi zaten kullanımda.', success: null }
    }

    await payload.create({
      collection: 'users',
      data: {
        name,
        email,
        password,
        roles: ['user'],
      },
    })

    // Sadece başarı mesajı dönüyoruz
    return { error: null, success: 'Kayıt başarılı!' }
  } catch (error) {
    console.error('Register Error:', error)
    return { error: 'Bir hata oluştu. Lütfen tekrar deneyin.', success: null }
  }
}

// 'use server'

// import { getPayload } from 'payload'
// import configPromise from '@payload-config'
// import { redirect } from 'next/navigation'

// export async function registerUser(prevState: any, formData: FormData) {
//   const name = formData.get('name') as string
//   const email = formData.get('email') as string
//   const password = formData.get('password') as string

//   if (!name || !email || !password) {
//     return { error: 'Lütfen tüm alanları doldurun.' }
//   }

//   try {
//     const payload = await getPayload({ config: configPromise })

//     // 1. Email kontrolü (Kullanıcı zaten var mı?)
//     const { docs: existingUsers } = await payload.find({
//       collection: 'users',
//       where: { email: { equals: email } },
//     })

//     if (existingUsers.length > 0) {
//       return { error: 'Bu e-posta adresi zaten kullanımda.' }
//     }

//     // 2. Yeni kullanıcıyı Payload'da oluştur
//     // Not: Payload 'auth' koleksiyonu olduğu için şifreyi otomatik hash'ler
//     await payload.create({
//       collection: 'users',
//       data: {
//         name,
//         email,
//         password, // Payload bunu arka planda güvenli hale getirecek
//         roles: ['user'], // Varsayılan rol
//       },
//     })
//     if (result) {
//       redirect('/login?success=Hesabınız oluşturuldu. Giriş yapabilirsiniz.')
//     }
//     return { success: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.' }
//   } catch (error) {
//     console.error('Register Error:', error)
//     return { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' }
//   }
// }
