import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://scoreline.site"),
  title: {
    default: "Scoreline",
    template: "%s | Scoreline",
  },
  description:
    "Scoreline covers sports updates, live scores, fixtures, results, and tournament news across global sports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
