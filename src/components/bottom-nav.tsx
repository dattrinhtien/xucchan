'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Trang chủ', icon: '🏠' },
  { href: '/nhap-lieu', label: 'Nhập liệu', icon: '✏️' },
  { href: '/lich-su', label: 'Lịch sử', icon: '📋' },
  { href: '/so-sanh', label: 'So sánh', icon: '📊' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card rounded-none border-t border-border/30">
      <div className="flex items-center justify-around py-2">
        {navItems.map(item => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-primary-light'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
