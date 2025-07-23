import type { Metadata } from 'next';
import {
  Inter,
  Poppins,
  Montserrat,
  Roboto,
  Open_Sans,
  Lato,
  Raleway,
  Playfair_Display,
  Dancing_Script,
  Pacifico,
  Great_Vibes,
  Satisfy,
  Kaushan_Script,
  Allura,
  Parisienne,
  Cormorant_Garamond,
  Cinzel_Decorative,
  Alex_Brush,
} from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishProvider } from '@/contexts/WishContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MonthlyLoginBonus } from '@/components/auth/MonthlyLoginBonus';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});
const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});
const openSans = Open_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-opensans',
});
const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
});
const raleway = Raleway({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-raleway',
});
const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-playfair',
});
const dancing = Dancing_Script({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-dancing',
});
const pacifico = Pacifico({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-pacifico',
});
const greatVibes = Great_Vibes({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-great-vibes',
});
const satisfy = Satisfy({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-satisfy',
});
const kaushan = Kaushan_Script({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-kaushan',
});
const allura = Allura({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-allura',
});
const parisienne = Parisienne({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-parisienne',
});
const cormorantGaramond = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant-garamond',
});
const cinzelDecorative = Cinzel_Decorative({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-cinzel-decorative',
});
const alexBrush = Alex_Brush({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-alex-brush',
});

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
      <body
        className={`${inter.className} ${poppins.variable} ${montserrat.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${raleway.variable} ${playfair.variable} ${dancing.variable} ${pacifico.variable} ${greatVibes.variable} ${satisfy.variable} ${kaushan.variable} ${allura.variable} ${parisienne.variable} ${cormorantGaramond.variable} ${cinzelDecorative.variable} ${alexBrush.variable}`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <WishProvider>
              {children}
              <MonthlyLoginBonus />
            </WishProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
