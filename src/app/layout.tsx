import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "XucChan - Đo Nhiệt Độ 12 Đường Kinh",
  description: "Ứng dụng nhập liệu và phân tích nhiệt độ 12 đường kinh theo phương pháp Y học cổ truyền",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-card border-b border-border/30 rounded-none">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                XC
              </div>
              <h1 className="text-lg font-bold gradient-text hidden sm:block">
                XucChan
              </h1>
            </a>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              <a href="/nhap-lieu" className="btn-secondary text-sm">
                ✏️ Nhập liệu
              </a>
              <a href="/lich-su" className="btn-secondary text-sm">
                📋 Lịch sử
              </a>
              <a href="/so-sanh" className="btn-secondary text-sm">
                📊 So sánh
              </a>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>

        {/* Bottom navigation for mobile */}
        <BottomNav />
      </body>
    </html>
  );
}
