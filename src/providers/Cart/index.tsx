'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface CartItem {
  id: string
  title: string
  price: number
  currency: string
  image: string
  quantity: number
  stock: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: CartItem) => void
  updateQuantity: (id: string, delta: number) => void // +1 veya -1 için
  removeFromCart: (id: string) => void
  clearCart: () => void
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('universal-cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem('universal-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        // Zaten varsa sadece adedi artır (Stok sınırına dikkat ederek)
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + product.quantity, item.stock || 99) }
            : item,
        )
      }
      return [...prev, product]
    })
  }

  // YENİ: Adet artırma/azaltma fonksiyonu
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta

          // Önemli: Eğer veritabanında stok 1 olarak kalmışsa artış durur.
          // Geliştirme aşamasında test için stok yoksa 99 kabul edelim.
          const maxAvailable = item.stock > 0 ? item.stock : 99

          console.log(
            `Ürün: ${item.title}, Mevcut: ${item.quantity}, Yeni: ${newQty}, Limit: ${maxAvailable}`,
          )

          return {
            ...item,
            quantity: Math.max(1, Math.min(newQty, maxAvailable)),
          }
        }
        return item
      }),
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

// 'use client'

// import React, { createContext, useContext, useEffect, useState } from 'react'

// interface CartItem {
//   id: string
//   title: string
//   price: number
//   currency: string
//   image: string
//   quantity: number
//   stock: number
// }

// interface CartContextType {
//   cart: CartItem[]
//   addToCart: (product: CartItem) => void
//   removeFromCart: (id: string) => void
//   clearCart: () => void
//   cartCount: number
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cart, setCart] = useState<CartItem[]>([])

//   // Sayfa yüklendiğinde localstorage'dan sepeti çek
//   useEffect(() => {
//     const savedCart = localStorage.getItem('universal-cart')
//     if (savedCart) setCart(JSON.parse(savedCart))
//   }, [])

//   // Sepet her değiştiğinde localstorage'a kaydet
//   useEffect(() => {
//     localStorage.setItem('universal-cart', JSON.stringify(cart))
//   }, [cart])

//   const addToCart = (product: CartItem) => {
//     setCart((prev) => {
//       const existing = prev.find((item) => item.id === product.id)
//       if (existing) {
//         return prev.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: Math.min(item.quantity + product.quantity, item.stock) }
//             : item,
//         )
//       }
//       return [...prev, product]
//     })
//   }

//   const removeFromCart = (id: string) => {
//     setCart((prev) => prev.filter((item) => item.id !== id))
//   }

//   const clearCart = () => setCart([])

//   const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
//       {children}
//     </CartContext.Provider>
//   )
// }

// export const useCart = () => {
//   const context = useContext(CartContext)
//   if (!context) throw new Error('useCart must be used within CartProvider')
//   return context
// }
