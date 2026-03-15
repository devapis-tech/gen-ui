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
  title: "Clinical Trial Forms - AI Powered",
  description: "AI-powered clinical trial form management with CopilotKit",
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
        <UserRoleProvider>
        <CopilotKit runtimeUrl="/api/copilotkit">
            <AppLayout>
              {children}
            </AppLayout>
          </CopilotKit>
        </UserRoleProvider>
      </body>
    </html>
  );
}
