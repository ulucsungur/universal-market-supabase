export const CATEGORY_GROUPS = [
  { label: 'Otomobil (Cars)', value: 'cars' },
  { label: 'Motosiklet (Motorcycle)', value: 'motorcycle' },
  { label: 'Emlak (Real Estate)', value: 'real-estate' },
  { label: 'Deniz Araçları (Marin Vessel)', value: 'marin-vessel' },
  { label: 'Moda (Fashion)', value: 'fashion' },
  { label: 'Kitap (Books)', value: 'books' },
  { label: 'Elektronik (Electronics)', value: 'electronics' },
  { label: 'Bilgisayar (Computer)', value: 'computer' },
  { label: 'Yapı Malzemesi (Construction Material)', value: 'construction-material' },
  { label: 'Diğer (Other)', value: 'other' },
] as const

export type CategoryGroupValue = (typeof CATEGORY_GROUPS)[number]['value']
