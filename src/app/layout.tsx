import type { Metadata } from "next";
import "./globals.css";
import Footer from '@/components/Footer';
import Header from "@/components/Header";
import { inter } from './fonts';

export const metadata: Metadata = {
  title: "Duc Bui - Software",
  description: "Duc Bui's personal portfolio",
  icons: {
    icon: '/favicon.ico',
  },
  keywords: ['Duc Bui', 'Entrepreneur', 'Software Business Owner', 'Web Development', 'App Development', 'Backend Development', 'DevOps', 'Infrastructure', 'Project Management'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
