import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  Playfair_Display,
  Inter,
  Poppins,
  Montserrat,
  Roboto,
  Open_Sans,
  Lato,
  Raleway,
  Dancing_Script,
  Pacifico,
} from 'next/font/google';
import './globals.css';
import { WishProvider } from '@/contexts/WishContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Beautiful Text Fonts
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

const openSans = Open_Sans({
  variable: '--font-opensans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const dancingScript = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const pacifico = Pacifico({
  variable: '--font-pacifico',
  subsets: ['latin'],
  weight: ['400'],
});

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
        <link
          href='https://fonts.googleapis.com/css2?family=Fredoka+One&family=Bangers&family=Righteous&family=Bubblegum+Sans&family=Comic+Neue:wght@300;400;700&family=Indie+Flower&family=Architects+Daughter&family=Permanent+Marker&family=Caveat:wght@400;500;600;700&family=Satisfy&display=swap'
          rel='stylesheet'
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} ${poppins.variable} ${montserrat.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${raleway.variable} ${dancingScript.variable} ${pacifico.variable} antialiased bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen`}
      >
        <ErrorBoundary>
          <WishProvider>{children}</WishProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
