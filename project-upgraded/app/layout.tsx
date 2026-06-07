import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portalio — Client portals for freelancers",
  description: "One link for every client project. Files, invoices, status, and chat — all in one place."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
