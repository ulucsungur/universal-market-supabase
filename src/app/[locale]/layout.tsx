import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import '@/app/globals.css';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ThemeProvider } from '@/providers/Theme';
import { CurrencyProvider } from '@/providers/Currency';
import { Metadata } from 'next';
import { CartProvider } from '@/providers/Cart';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: {
      template: '%s | Universal Market',
      default: 'Universal Market | Vasıta, Emlak ve Sanayi İlanları',
    },
    description: 'Dünyanın en gelişmiş ve güvenli ilan platformu.',
    metadataBase: new URL('http://localhost:3000'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className="bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <CurrencyProvider>
          <CartProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </ThemeProvider>
            </NextIntlClientProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
