import type { Metadata } from "next";
import "./globals.css";
import { LayoutClientWrapper } from "./LayoutClientWrapper";

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
    <html lang="en">
      <body className="antialiased">
        <LayoutClientWrapper>
          {children}
        </LayoutClientWrapper>
      </body>
    </html>
  );
}
