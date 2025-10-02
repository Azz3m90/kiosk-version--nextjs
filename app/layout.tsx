import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { KioskProvider } from '@/context/KioskContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { IdleTimer } from '@/components/ui/IdleTimer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Restaurant Kiosk - Order System',
  description: 'Modern restaurant kiosk ordering system with multi-language support',
  keywords: ['restaurant', 'kiosk', 'ordering', 'food', 'drinks'],
  authors: [{ name: 'Restaurant Kiosk' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent theme transition flash on initial load
              (function() {
                document.documentElement.classList.add('no-transition');
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    document.documentElement.classList.remove('no-transition');
                  }, 100);
                });
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <ErrorBoundary>
          <KioskProvider>
            {children}
            <IdleTimer idleTimeout={90000} warningTimeout={30000} />
          </KioskProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}