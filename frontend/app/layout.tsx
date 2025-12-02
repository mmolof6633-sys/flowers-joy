import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { Providers } from '@shared/providers/Providers';
import { Header } from '@widgets/header';
import type { Metadata } from 'next';
import './globals.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Flowers Joy - Цветочный магазин',
  description: 'Онлайн магазин цветов',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={roboto.className}>
        <AppRouterCacheProvider>
          <Providers>
            <Header />
            <main>{children}</main>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
