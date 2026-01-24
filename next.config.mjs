import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Buraya ileride Supabase resim domainlerini ekleyeceğiz
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cduhrvqdgpcdcqmphwos.supabase.co'
      },
    ],
  },
};

export default withNextIntl(nextConfig);
