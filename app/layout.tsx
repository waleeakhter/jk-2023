import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.scss";
import React from "react";
import { auth } from "./auth";
import AuthProvider from "./context/AuthProvider";
import "@fortawesome/fontawesome-svg-core/styles.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
const inter = Inter({ subsets: ["latin"] });
const APP_NAME = "JK Trading";
const APP_DEFAULT_TITLE = "JK Trading";
const APP_TITLE_TEMPLATE = "%s -  App";
const APP_DESCRIPTION =
  "JK Trading is a trading company that deals in mobile phones and accessories. We are the leading mobile phone distributor in the Portugal";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  creator: "Waleed Akhter",
  authors: {
    name: "Waleed Akhter",
    url: "https://www.linkedin.com/in/waleed-akhter-71b1761b3/",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#18181B",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <AuthProvider>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
