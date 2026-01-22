'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function createOrderAction(orderData: {
  listingId: number | string
  amount: number
  quantity: number
  orderType: 'purchase' | 'rental'
  fullName: string // 👈 Ekledik
  phone: string // 👈 Ekledik
  shippingAddress: string // 👈 Ekledik
  city: string // 👈 Ekledik
  zipCode?: string // 👈 Ekledik
  startDate?: string
  endDate?: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Oturum açmalısınız.' }

  const payload = await getPayload({ config: configPromise })

  try {
    // 1. ÖNCE ÜRÜNÜN MEVCUT STOĞUNU KONTROL ET
    const listing = await payload.findByID({
      collection: 'listings',
      id: orderData.listingId,
    })

    // Eğer online satış açık bir ürünse stok kontrolü yap
    if (listing.allowOnlinePurchase) {
      const currentStock = listing.stock || 0
      const orderQty = orderData.quantity || 1 // Sepetten geliyorsa adet bilgisi

      if (currentStock < orderQty) {
        return { error: 'Maalesef ürünün stoğu az önce tükendi.' }
      }

      // 2. STOĞU GÜNCELLE (DÜŞÜR)
      await payload.update({
        collection: 'listings',
        id: orderData.listingId,
        data: {
          stock: currentStock - orderQty,
        },
      })
    }

    // 3. SİPARİŞİ OLUŞTUR (Mevcut kodun devamı)
    const newOrder = await payload.create({
      collection: 'orders',
      data: {
        buyer: Number(session.user.id),
        listing: Number(orderData.listingId),
        orderType: orderData.orderType,
        totalAmount: orderData.amount,
        status: 'paid',
        // ADRES VERİLERİ VERİTABANINA YAZILIYOR
        fullName: orderData.fullName,
        phone: orderData.phone,
        shippingAddress: orderData.shippingAddress,
        city: orderData.city,
        zipCode: orderData.zipCode,
        startDate: orderData.startDate,
        endDate: orderData.endDate,
      },
    })

    revalidatePath('/orders')
    return { success: true, id: newOrder.id }
  } catch (error: any) {
    return { error: 'Sipariş kaydedilemedi.' }
  }
}

export async function updateOrderStatusAction(
  orderId: number | string,
  newStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled',
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Yetkisiz erişim.' }

  const payload = await getPayload({ config: configPromise })

  try {
    // 1. Siparişi bul ve satıcı kontrolü yap (Güvenlik)
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 1,
    })

    // Sadece ilanın sahibi veya admin durumu değiştirebilir
    const isOwner = Number((order.listing as any).author) === Number(session.user.id)
    const isAdmin = session.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return { error: 'Bu siparişi güncelleme yetkiniz yok.' }
    }

    // 2. Durumu güncelle
    await payload.update({
      collection: 'orders',
      id: orderId,
      data: { status: newStatus },
    })

    revalidatePath('/sales')
    revalidatePath('/orders')
    return { success: true }
  } catch (error) {
    return { error: 'Güncelleme başarısız.' }
  }
}
