'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const successMessage = searchParams.get('success')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Hataları yakalamak için false yapıyoruz
    })

    if (result?.error) {
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-50 dark:bg-[#0a0a0a] transition-colors">
      <div className="p-6 sm:p-10 bg-white dark:bg-neutral-900 shadow-2xl rounded-3xl border border-slate-200 dark:border-neutral-800 w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-black text-center mb-2 text-slate-900 dark:text-white tracking-tight">
          Hoş Geldiniz
        </h1>
        <p className="text-center text-slate-500 dark:text-neutral-400 text-sm mb-8">
          Devam etmek için giriş yapın.
        </p>

        {/* Başarı veya Hata Mesajları */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-xs font-bold text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* E-posta ve Şifre Formu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="E-posta Adresi"
            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-transparent text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Şifre"
            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-transparent text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-neutral-800"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-neutral-900 px-4 text-slate-400">Veya</span>
          </div>
        </div>

        {/* Google ile Giriş */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all font-semibold text-slate-700 dark:text-neutral-200"
        >
          <Image
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Google ile Devam Et
        </button>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-neutral-500">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  )
}

// import { signIn } from '@/auth'
// import Image from 'next/image'

// export default function LoginPage() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
//       <div className="p-8 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md transition-colors">
//         <h1 className="text-2xl font-bold text-center mb-6 text-zinc-900 dark:text-white">
//           UNIVERSAL MARKET&apos;e Hoş Geldiniz
//         </h1>

//         <form
//           action={async () => {
//             'use server'
//             await signIn('google', { redirectTo: '/' })
//           }}
//         >
//           <button
//             type="submit"
//             className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all font-medium text-zinc-700 dark:text-zinc-200 shadow-sm"
//           >
//             <Image
//               src="https://authjs.dev/img/providers/google.svg"
//               alt="Google Logo"
//               width={20}
//               height={20}
//               priority // Sayfa açılışında hız için öncelik verdik
//             />
//             Google ile Giriş Yap
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
//           Giriş yaparak kullanım koşullarını kabul etmiş olursunuz.
//         </p>
//       </div>
//     </div>
//   )
// }
