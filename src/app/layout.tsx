'use client';

// system level import
import "./globals.css";

// library level import
import { Inter } from 'next/font/google'

// component level import
import Provider from '../components/Provider'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${inter.className} h-full scroll-smooth antialiased`}
    >
      <body className='flex h-full flex-col'>
        <Provider>
          <Header />
          <main className='grow'>{children}</main>
        </Provider>
      </body>
    </html>
  )
}