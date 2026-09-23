import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'FlowTwin AI — AI-Native Industrial Operations Twin',
  description:
    'A 3D industrial environment where AI understands factory state, investigates problems, simulates changes, and turns the result into actionable decisions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex h-screen flex-col overflow-hidden bg-twin-bg text-slate-100 antialiased font-sans">
        <Header />
        <main className="flex-1 overflow-hidden p-3">{children}</main>
      </body>
    </html>
  );
}
