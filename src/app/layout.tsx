import type { Metadata } from "next";
import "./globals.css";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { ChatSidebarProvider } from "@/contexts/ChatSidebarContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { CopilotKit } from "@copilotkit/react-core";

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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <CopilotKit runtimeUrl="/api/copilotkit">
          <UserRoleProvider>
            <ChatSidebarProvider>
              <AppLayout>
                {children}
              </AppLayout>
            </ChatSidebarProvider>
          </UserRoleProvider>
        </CopilotKit>
      </body>
    </html>
  );
}
