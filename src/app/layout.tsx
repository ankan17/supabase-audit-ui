import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import AuthLayout from './AuthLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Delve | Supabase Audit',
  description: 'Let Delve help you audit your compliance concerns away.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]`}
      >
        <div className="min-h-screen flex flex-col items-center justify-center">
          <AuthLayout>
            {children}
          </AuthLayout>
        </div>
      </body>
    </html>
  );
}
