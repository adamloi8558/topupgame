import type { Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import { AppProviders } from '@/components/providers/app-providers'

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['latin', 'thai'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans-thai',
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['เติมเกม', 'ขายไอดีเกม', 'ROV', 'Free Fire', 'VALORANT', 'topup', 'gaming'],
  authors: [{ name: 'DumStore' }],
  creator: 'DumStore',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: '/',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${notoSansThai.variable} ${notoSansThai.className}`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
} 