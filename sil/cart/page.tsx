'use client'

import React from 'react'
import { useCart } from '@/providers/Cart'
import { useCurrency } from '@/providers/Currency'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function CartPage() {
  const { cart, removeFromCart, addToCart, updateQuantity, clearCart } = useCart()
  const { convert } = useCurrency()
  const t = useTranslations('Cart')

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 transition-colors">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12">Alışveriş Sepeti</h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* ÜRÜN LİSTESİ */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm"
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 text-slate-900 dark:text-white">
                    <h3 className="font-black uppercase truncate text-sm tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-purple-600 font-bold text-lg">
                      {convert(item.price, item.currency)}
                    </p>
                  </div>

                  {/* ADET KONTROLÜ */}
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-2 px-4 rounded-xl border border-slate-100 dark:border-white/10">
                    <button
                      onClick={() => updateQuantity(item.id, -1)} // 👈 Adedi 1 azaltır
                      className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="font-black text-sm w-6 text-center text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)} // 👈 Adedi 1 artırır
                      className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* SİPARİŞ ÖZETİ */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 rounded-[3rem] shadow-xl sticky top-32">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-purple-600 mb-8 text-slate-900 dark:text-white">
                  Sipariş Özeti
                </h2>
                <div className="space-y-4 border-b border-slate-100 dark:border-white/5 pb-6 mb-6">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Ara Toplam</span>
                    <span>{convert(subtotal, 'TRY')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Kargo</span>
                    <span className="text-green-600 font-bold">Ücretsiz</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-10">
                  <span className="font-black uppercase text-xs tracking-widest text-slate-900 dark:text-white">
                    Toplam
                  </span>
                  <span className="text-3xl font-black tracking-tighter text-purple-600">
                    {convert(subtotal, 'TRY')}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-600/30 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  Ödemeye Geç <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-40 text-center bg-white dark:bg-slate-900/50 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-white/10">
            <ShoppingBag size={64} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] mb-8">
              Sepetiniz şu an boş.
            </p>
            <Link
              href="/"
              className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest"
            >
              Alışverişe Başla
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
