// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // En dıştaki layout sadece içeriği geçer,
  // html/body etiketlerini [locale]/layout.tsx halledecek.
  return children;
}
