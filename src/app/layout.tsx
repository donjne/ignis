import { Metadata } from 'next';
import GlobalLayout from '@/components/providers/GlobalLayout';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'IGNIS - Launch Your Digital Assets',
  description: 'Create and manage your digital assets on the Solana blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={orbitron.className}>
        <GlobalLayout>
          {children}
        </GlobalLayout>
      </body>
    </html>
  );
}