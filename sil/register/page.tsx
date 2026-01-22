'use client' // Form durumunu yönetmek için client component yapıyoruz

import { registerUser, type RegisterActionState } from '@/lib/actions/register'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useActionState, useEffect } from 'react' // useEffect ekledik
import { useRouter } from 'next/navigation' // useRouter ekledik

const initialState: RegisterActionState = {
  error: null,
  success: null,
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState)
  const router = useRouter()

  // Başarı mesajı geldiğinde yönlendirme yap
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/login?success=Hesabınız oluşturuldu. Giriş yapabilirsiniz.')
      }, 2000) // 2 saniye mesajı göster sonra yönlendir
      return () => clearTimeout(timer)
    }
  }, [state.success, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a] px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-900 p-6 sm:p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-neutral-800">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Hesap Oluştur
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-neutral-400">
            Ücretsiz üye ol ve ilanlarını yönetmeye başla.
          </p>
        </div>

        {/* Mesaj Bildirimleri - state.error ve state.success artık güvenli */}
        <div className="space-y-3">
          {state.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
              {state.success}
            </div>
          )}
        </div>

        <form action={formAction} className="mt-8 space-y-5">
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              required
              placeholder="İsim Soyisim"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="E-posta"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Şifre"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            {isPending ? 'Kaydediliyor...' : 'Ücretsiz Kayıt Ol'}
          </button>
        </form>
        {state.success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
            {state.success} Giriş sayfasına yönlendiriliyorsunuz...
          </div>
        )}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-neutral-800"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-neutral-900 px-4 text-slate-500 font-medium">
              Veya
            </span>
          </div>
        </div>

        {/* Google Butonu - SVG İkon İçinde */}
        <button
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 py-3.5 rounded-xl text-slate-700 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Google ile Devam Et</span>
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-neutral-400 mt-6">
          Zaten hesabın var mı?{' '}
          <Link
            href="/login"
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}
