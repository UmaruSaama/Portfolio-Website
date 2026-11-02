import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { HeaderGate } from "@/components/HeaderGate";

export const metadata: Metadata = {
  title: "Shivam — Product Designer",
  description: "I design experiences that feel simple.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <HeaderGate>
          <SiteHeader />
        </HeaderGate>
        {children}
      </body>
    </html>
  );
}
