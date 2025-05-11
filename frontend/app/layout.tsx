import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import RightSidebar from "./components/layout/RightSidebar";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "facebook",
  description: "A simple social media application to connect with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100">
        <AuthProvider>
          <Navbar />
          <div className="flex-grow container mx-auto px-2 py-4 max-w-6xl">
            <div className="flex">
              <Sidebar />
              <main className="flex-grow px-2">
                {children}
              </main>
              <RightSidebar />
            </div>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
