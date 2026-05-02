import Link from 'next/link';
import { getSessions } from './actions/get-sessions';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { sessions, total } = await getSessions(5, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-8 space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
          <span className="text-4xl">🌡️</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text">
          XucChan
        </h1>
        <p className="text-text-secondary text-base md:text-lg max-w-md mx-auto">
          Đo nhiệt độ 12 đường kinh · Phân tích Hàn Nhiệt · Theo dõi xu hướng
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/nhap-lieu" className="glass-card glass-card-hover p-6 text-center group">
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✏️</div>
          <h3 className="font-semibold text-lg mb-1">Đo mới</h3>
          <p className="text-text-secondary text-sm">Nhập liệu 12 đường kinh</p>
        </Link>

        <Link href="/lich-su" className="glass-card glass-card-hover p-6 text-center group">
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
          <h3 className="font-semibold text-lg mb-1">Lịch sử</h3>
          <p className="text-text-secondary text-sm">{total} lần đo đã lưu</p>
        </Link>

        <Link href="/so-sanh" className="glass-card glass-card-hover p-6 text-center group">
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
          <h3 className="font-semibold text-lg mb-1">So sánh</h3>
          <p className="text-text-secondary text-sm">So sánh nhiều lần đo</p>
        </Link>
      </div>

      {/* Recent Sessions */}
      {sessions && sessions.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>🕐</span> Đo gần đây
            </h2>
            <Link href="/lich-su" className="text-primary-light text-sm hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="space-y-3">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/ket-qua/${session.id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-2/50 hover:bg-surface-3/50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">
                      {session.patients?.full_name || 'Chưa có tên'}
                    </span>
                    {session.patients?.patient_code && (
                      <span className="text-xs text-text-secondary bg-surface-3 px-2 py-0.5 rounded">
                        {session.patients.patient_code}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {new Date(session.measured_at).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {session.operator_name && ` · ${session.operator_name}`}
                  </div>
                </div>
                <div className="text-text-secondary group-hover:text-primary-light transition-colors text-lg">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-primary-light">{total}</div>
          <div className="text-xs text-text-secondary mt-1">Tổng lần đo</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-accent">12</div>
          <div className="text-xs text-text-secondary mt-1">Đường kinh</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-success">6+6</div>
          <div className="text-xs text-text-secondary mt-1">Tay + Chân</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-warning">24</div>
          <div className="text-xs text-text-secondary mt-1">Điểm đo / lần</div>
        </div>
      </div>
    </div>
  );
}
