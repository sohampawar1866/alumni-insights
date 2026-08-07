import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alumni Insights - IIIT Nagpur",
  description:
    "Official IIIT Nagpur alumni discovery and mentorship platform for career guidance and networking. A product by Shani Digital Works in collaboration with Alumni Committee, IIITN.",
  icons: {
    icon: "/images/iiitn.png",
    shortcut: "/images/iiitn.png",
    apple: "/images/iiitn.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Alumni Insights",
  },
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: "bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-xl font-sans text-slate-900",
            style: {
              padding: "16px"
            },
            classNames: {
              title: "text-slate-900 font-bold text-sm",
              description: "text-slate-600 font-medium text-xs mt-1",
              error: "bg-red-50 border-2 border-red-900 text-red-900 shadow-[2px_2px_0px_#0f172a]",
              success: "bg-emerald-50 border-2 border-emerald-900 text-emerald-900 shadow-[2px_2px_0px_#0f172a]",
              actionButton: "bg-slate-900 text-white rounded-lg font-bold text-xs px-3 py-1.5 hover:bg-slate-800",
              cancelButton: "bg-slate-100 text-slate-700 rounded-lg font-bold text-xs px-3 py-1.5 hover:bg-slate-200",
            }
          }}
        />
      </body>
    </html>
  );
}
