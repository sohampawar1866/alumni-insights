import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alumni Insights — IIIT Nagpur",
  description:
    "Discover and connect with IIIT Nagpur alumni for career guidance, mentorship, and networking.",
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
          toastOptions={{
            className: "bg-background border-4 border-foreground shadow-[6px_6px_0px_var(--color-foreground)] rounded-none font-black uppercase tracking-wide",
            style: {
              padding: "16px"
            },
            classNames: {
              title: "text-foreground text-sm uppercase",
              description: "text-muted-foreground font-bold mt-1",
              error: "bg-destructive border-4 border-foreground text-background shadow-[6px_6px_0px_var(--color-foreground)]",
              success: "bg-primary border-4 border-foreground text-background shadow-[6px_6px_0px_var(--color-foreground)]",
              actionButton: "bg-foreground text-background rounded-none border-2 border-transparent uppercase font-black px-4",
              cancelButton: "bg-muted text-foreground rounded-none border-2 border-foreground uppercase font-black px-4 hover:bg-secondary",
            }
          }}
        />
      </body>
    </html>
  );
}
