import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Movementum — We turn promising ideas into global movements.",
  description:
    "Movementum builds the machine to carry a category-defining idea into the world — and the community that keeps it alive once it lands.",
  icons: {
    icon: "/images/movemental.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav />
        {/* Brand strip — sits directly under the nav on every page */}
        <div className="border-b border-zinc-100 bg-white">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-2 flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint border border-[#a8dcf5] text-[10px] font-extrabold tracking-[0.16em] uppercase text-brand">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Movement, not marketing
            </div>
          </div>
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
