import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { ServiceWorkerRegister } from "@/components/providers/service-worker-register";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SANAD",
  description:
    "SANAD connects smart glasses with a mobile app to assist people with hearing, vision, and speech needs.",
  applicationName: "SANAD",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SANAD",
  },
  icons: {
    icon: "/assets/sanad-logo.png",
    apple: "/assets/sanad-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#FAF7F0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground app-viewport">
        <AppProviders>{children}</AppProviders>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
