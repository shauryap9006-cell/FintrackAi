import './globals.css';
import { ThemeProvider } from './providers';
import { Toaster } from 'react-hot-toast';
import AppLayout from '@/components/AppLayout';

export const metadata = {
  title: 'FinTrack AI — Smart Finance Tracking',
  description: 'Track your finances with AI-powered insights, analytics, and smart budgeting. Built with modern fintech design.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-200">
        <ThemeProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 12,
                fontSize: 14,
                boxShadow: '0 8px 30px var(--shadow-color)',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: 'white' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: 'white' },
              },
            }}
          />
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
