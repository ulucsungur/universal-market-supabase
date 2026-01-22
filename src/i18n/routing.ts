// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // Desteklenen diller
  locales: ['en', 'tr'],

  // Varsayılan dil
  defaultLocale: 'tr',

  // URL'de dil kodu her zaman görünsün mü?
  // 'as-needed' sadece varsayılan dil dışındakilerde gösterir.
  // 'always' her zaman /tr/.. veya /en/.. şeklinde gösterir.
  localePrefix: 'always',
})

// Proje genelinde kullanacağın yönlendirme araçlarını buradan export ediyoruz
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)

// request.ts için locales listesini export edelim
export const locales = routing.locales
