import Link from 'next/link';
import { getSessions } from '@/app/actions/get-sessions';

export const dynamic = 'force-dynamic';

export default async function LichSuPage() {
  const { sessions, total } = await getSessions(100, 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          📋 Lịch sử đo ({total} lần)
        </h2>
        <Link href="/nhap-lieu" className="btn-primary text-sm">
          ✏️ Đo mới
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-text-secondary">Chưa có lần đo nào</p>
          <Link href="/nhap-lieu" className="btn-primary mt-4 inline-flex">
            Bắt đầu đo
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, idx) => (
            <Link
              key={session.id}
              href={`/ket-qua/${session.id}`}
              className="glass-card glass-card-hover p-4 md:p-5 block animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Patient name & code */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold truncate">
                      {session.patients?.full_name || 'Chưa có tên'}
                    </span>
                    {session.patients?.patient_code && (
                      <span className="text-xs text-text-secondary bg-surface-3/60 px-2 py-0.5 rounded-md shrink-0">
                        {session.patients.patient_code}
                      </span>
                    )}
                  </div>

                  {/* Date & operator */}
                  <div className="text-sm text-text-secondary flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      📅 {new Date(session.measured_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {session.operator_name && (
                      <span>👤 {session.operator_name}</span>
                    )}
                  </div>

                  {/* Quick stats */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {session.upper_group_center && (
                      <span className="text-xs bg-primary/10 text-primary-light px-2 py-0.5 rounded">
                        Tay: {session.upper_group_center}°C
                      </span>
                    )}
                    {session.lower_group_center && (
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                        Chân: {session.lower_group_center}°C
                      </span>
                    )}
                    {session.upper_lower_diff != null && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        Number(session.upper_lower_diff) > 0
                          ? 'bg-nhiet/10 text-nhiet'
                          : Number(session.upper_lower_diff) < 0
                          ? 'bg-han/10 text-han'
                          : 'bg-binh/10 text-binh'
                      }`}>
                        Δ: {Number(session.upper_lower_diff) > 0 ? '+' : ''}{Number(session.upper_lower_diff).toFixed(2)}°C
                      </span>
                    )}
                  </div>

                  {/* Symptoms */}
                  {session.symptoms_note && (
                    <p className="text-xs text-text-secondary mt-2 truncate">
                      💬 {session.symptoms_note}
                    </p>
                  )}
                </div>

                <div className="text-text-secondary text-lg shrink-0 mt-1">→</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
