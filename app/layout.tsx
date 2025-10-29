import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuizD - Quiz App",
  description: "A quiz game for the whole family",
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
