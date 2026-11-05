import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/provider/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteDescription =
  "Borrow physical books from neighbours, share titles from your own shelf, and keep stories circulating in your community.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
  ),
  applicationName: "BookNook",
  title: {
    default: "BookNook",
    template: "BookNook | %s",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "BookNook",
    title: "BookNook",
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "BookNook",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#fbfdfb] text-zinc-900 dark:bg-[#0a110e] dark:text-white transition-colors duration-200">
        <ThemeProvider>
          <Toaster>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
