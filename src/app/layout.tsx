import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Healing Space |  Maheen - Clinical Psychologist",
  description:
    "A compassionate psychological sanctuary founded by  Maheen. Offering evidence-based counselling, anxiety & depression therapy, trauma healing, and 1-on-1 sessions. DM or WhatsApp 03149341597 to book.",
  keywords: [
    "The Healing Space",
    " Maheen",
    "Psychologist",
    "Clinical Psychology",
    "Mental Health Counselling",
    "Anxiety Therapy",
    "Depression Support",
    "Evidence-based therapy",
    "03149341597",
    "healingspace.psychology",
  ],
  authors: [{ name: " Maheen - Clinical Psychologist" }],
  icons: {
    icon: [
      { url: "/images/logo.png", href: "/images/logo.png" },
      { url: "/favicon.ico", href: "/favicon.ico" },
    ],
    apple: [{ url: "/images/logo.png", href: "/images/logo.png" }],
    shortcut: ["/images/logo.png"],
  },
  openGraph: {
    title: "The Healing Space |  Maheen - Clinical Psychologist",
    description: "Support • Understand • Heal. Compassionate evidence-based counselling & psychotherapy.",
    url: "https://healingspace.psychology",
    siteName: "The Healing Space",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "The Healing Space Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${jakartaSans.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#0e1411] text-[#edf4ef] antialiased selection:bg-[#2c4939] selection:text-[#cbdfd1]">
        {children}
      </body>
    </html>
  );
}
