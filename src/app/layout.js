import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { VideoProvider } from "@/context/VideoContext";
import { Toaster } from "sonner";
import { UserInteractionsProvider } from "@/context/UserInteractionsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Stream D - Football Highlights",
    template: "%s | Stream D",
  },
  description:
    "Watch the latest football highlights from top leagues around the world. Stay updated with goals, match replays, and trending football clips.",
  keywords: [
    "football highlights",
    "soccer highlights",
    "match replays",
    "football clips",
    "live football",
  ],
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://streamd.ng"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserInteractionsProvider>
            <AuthProvider>
              <VideoProvider>
                <Toaster position="top-center" richColors />
                {children}
              </VideoProvider>
            </AuthProvider>
          </UserInteractionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
