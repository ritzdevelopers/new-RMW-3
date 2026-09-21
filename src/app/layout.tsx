import type { Metadata } from "next";
import { Archivo_Black, Inter, Montserrat, Outfit, Plus_Jakarta_Sans, Quattrocento, Quicksand, Space_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { AppProviders } from "@/components/providers/AppProviders";
import { site } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-quicksand",
});

const quattrocento = Quattrocento({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-quattrocento",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} — ${site.tagline}`,
    template: `%s — ${site.fullName}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${archivo.variable} ${inter.variable} ${montserrat.variable} ${jakarta.variable} ${quicksand.variable} ${quattrocento.variable} ${spaceMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="bg-background font-sans text-foreground"
        suppressHydrationWarning
      >
        <AppProviders>
          <Header />
          <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
