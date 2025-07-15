import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishProvider } from '@/contexts/WishContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WishLuu - Create Beautiful Wishes',
  description:
    'Create and share beautiful interactive wishes with animations and personal touches.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <WishProvider>{children}</WishProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
