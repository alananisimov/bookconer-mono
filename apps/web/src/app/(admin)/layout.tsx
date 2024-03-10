import "~/styles/globals.css";

import { Lato } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/hoc/theme-provider";

import { Toaster } from "~/components/shared/ui/shadcn/sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "@acme/api";
import { redirect } from "next/navigation";

const inter = Lato({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-sans",
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user.isAdmin) {
    redirect("/");
  }
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-[var(--background)]`}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
