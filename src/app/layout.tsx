import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { LayoutClientWrapper } from "./LayoutClientWrapper";
import { query } from "@/lib/db";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-lora",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settingsRows, departmentRows] = await Promise.all([
    query<{ key: string; value: string }>('SELECT key, value FROM settings'),
    query<{ id: string; name: string }>('SELECT id, name FROM departments ORDER BY name ASC')
  ]);

  const settings: Record<string, string> = {};
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }

  return (
    <html lang="en" className={`${lora.variable}`}>
      <body className="antialiased">
        <LayoutClientWrapper settings={settings} departments={departmentRows}>
          {children}
        </LayoutClientWrapper>
      </body>
    </html>
  );
}

