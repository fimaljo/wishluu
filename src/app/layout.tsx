import type { Metadata } from 'next';
import './globals.css';
import { WishProvider } from '@/contexts/WishContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'WishLuu - Create & Send Interactive Wishes',
  description:
    "Create and send custom, interactive, emotional wishes for birthdays, Valentine's Day, Mother's Day, proposals, and more special occasions.",
  keywords:
    "wishes, greetings, interactive, birthday, valentine, mother's day, proposals, custom wishes",
  authors: [{ name: 'WishLuu Team' }],
  creator: 'WishLuu',
  openGraph: {
    title: 'WishLuu - Create & Send Interactive Wishes',
    description:
      'Create and send custom, interactive, emotional wishes for special occasions',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WishLuu - Create & Send Interactive Wishes',
    description:
      'Create and send custom, interactive, emotional wishes for special occasions',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
      </head>
      <body
        className={`antialiased bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen`}
      >
        <ErrorBoundary>
          <WishProvider>{children}</WishProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
