import type { Metadata } from "next";
import { Playfair_Display, Poppins, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { LayoutClientWrapper } from "./LayoutClientWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Government Dental College & Hospital, Dibrugarh",
    default: "Government Dental College & Hospital, Dibrugarh | Assam",
  },
  description: "Official portal of Government Dental College and Hospital, Dibrugarh, Assam. Affiliated to Dibrugarh University and recognized by the Dental Council of India (DCI), New Delhi.",
  keywords: ["Government Dental College Dibrugarh", "GDC Dibrugarh", "Dental College Assam", "BDS Dibrugarh", "MDS Admission Assam", "Dentistry Dibrugarh University"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} ${sourceSans.variable}`}>
      <body className="antialiased">
        <LayoutClientWrapper>
          {children}
        </LayoutClientWrapper>
      </body>
    </html>
  );
}

