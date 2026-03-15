import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { CopilotKit } from "@copilotkit/react-core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multiplier AI - Clinical Trial",
  description: "Internal AI-powered clinical trial management environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CopilotKit runtimeUrl="/api/copilotkit">
          <UserRoleProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </UserRoleProvider>
        </CopilotKit>
      </body>
    </html>
  );
}
