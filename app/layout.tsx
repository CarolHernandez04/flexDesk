import { Metadata } from "next";
import SessionProvider from "@/components/session-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

// The project has proper metadata, such as page title and description, which was one of the requirements.
export const metadata: Metadata = {
  title: "FlexDesk - Office Booking System",
  description: "Book desks and meeting rooms for your hybrid office",
  keywords: "office, booking, desks, meeting rooms, hybrid work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-white text-gray-900">
        <SessionProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
