import type { Metadata } from "next";
import "./globals.css";
import Footer from '@/components/Footer';
import Header from "@/components/Header";
import { inter } from './fonts';
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  metadataBase: new URL('https://theducbui.com'),
  title: "Duc Bui - Software",
  description: "A software development portfolio by Duc Bui.",
  icons: {
    icon: '/favicon.ico',
  },
  keywords: ['Duc Bui', 'Entrepreneur', 'Software Business Owner', 'Web Development', 'App Development', 'Backend Development', 'DevOps', 'Infrastructure', 'Project Management'],
  openGraph: {
    title: "Duc Bui - Software",
    description: "A software development portfolio by Duc Bui.",
    url: "https://www.theducbui.com/",
    siteName: "Duc Bui",
    images: [
      {
        url: "/public/open-graph-img.jpg",
        alt: "Duc Bui Software Preview",
      },
    ],
    type: "website",
  },
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
        <main className="flex-grow bg-white">
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  );
}
