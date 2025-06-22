import type { Metadata } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { NotificationProvider } from "@/contexts/NotificationContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Presence Tracker | TheGuysOfFalta",
  description: "Acompanhe sua presença, mantenha seu streak diário e alcance novos objetivos",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["presença", "streak", "acompanhamento", "dashboard", "TheGuysOfFalta"],
  authors: [{ name: "TheGuysOfFalta Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-neutral-50 font-sans antialiased">
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
