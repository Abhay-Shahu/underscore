import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Header from "@/components/header";
import { DM_Sans, Lora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Underscore — AI Mock Interview Marketplace",
  description: "Master your technical interviews with senior engineers and instant AI feedback.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${lora.variable} ${dmSans.variable} font-sans`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="relative z-10 border-t border-white/7 py-8 mx-auto px-6 flex flex-wrap items-center justify-between max-w-6xl text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="font-serif text-amber-400 font-bold text-sm leading-none border border-amber-400/30 rounded px-1.5 py-0.5 bg-amber-400/10">U_</span>
                <span className="text-stone-300 font-medium">Underscore</span>
                <span>© {new Date().getFullYear()}</span>
              </div>
              <p>AI-Powered Mock Interview Marketplace</p>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
