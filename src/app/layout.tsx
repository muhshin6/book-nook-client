import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/provider/theme-provider";
import Script from "next/script";

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

export const metadata: Metadata = {
  title: {
    default: "BookNook",
    template: "BookNook | %s",
  },
  description:
    "Your personal book library.",
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
      <head>
      </head>
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
