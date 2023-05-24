import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chatter',
  description: 'A Chat/Blog Webapp by Christian Enyia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} mx-auto w-[98%] p-0 box-border`}>{children}</body>
    </html>
  )
}
