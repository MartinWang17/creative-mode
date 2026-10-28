import type { Metadata } from "next";
import { Jersey_10, Silkscreen, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./landing.css";

const jersey = Jersey_10({
  variable: "--font-jersey",
  weight: "400",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Mode by Martin Wang",
  description:
    "Creative Mode by Martin Wang. Deep breakdowns of what's working for Instagram creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jersey.variable} ${silkscreen.variable} ${grotesk.variable}`}
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
