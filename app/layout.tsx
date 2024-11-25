import type { Metadata } from "next";
import "./globals.css";
import{ Nunito } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";
import Modal from "./components/modals/Modal";


const font = Nunito ({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
         <Modal actionLabel='Submit' title="Hello Shaheer "isOpen />
        <Navbar/>
        </ClientOnly>

        {children}
      </body>
    </html>
  );
}
