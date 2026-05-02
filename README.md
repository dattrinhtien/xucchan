# XucChan - Ứng dụng Đo Nhiệt Độ 12 Đường Kinh

Webapp nội bộ để nhập số đo nhiệt độ 12 đường kinh, tính toán theo logic nghiệp vụ Y học cổ truyền, hiển thị biểu đồ, lưu lịch sử, so sánh nhiều lần đo, và xuất PDF.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **PDF Export**: jsPDF + html2canvas
- **Deploy**: Vercel

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <repo-url>
cd xucchan-app
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Cấu hình Supabase

#### a. Tạo project trên [Supabase](https://supabase.com)

1. Đăng nhập Supabase Dashboard
2. Tạo project mới
3. Vào **Settings > API** để lấy:
   - Project URL
   - Anon public key

#### b. Tạo file `.env.local`

```bash
cp .env.example .env.local
```

Điền thông tin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### c. Chạy SQL schema

1. Vào Supabase Dashboard > **SQL Editor**
2. Copy và chạy nội dung file `supabase/schema.sql`
3. Copy và chạy nội dung file `supabase/seed.sql` (dữ liệu demo)

### 4. Chạy local

```bash
npm run dev
```

Truy cập: [http://localhost:3000](http://localhost:3000)

### 5. Chạy tests

```bash
npm test
```

## 🚀 Deploy lên Vercel

### 1. Push code lên GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import project trên Vercel

1. Đăng nhập [Vercel](https://vercel.com)
2. Click **"New Project"** > Import repository
3. Chọn **Framework Preset**: Next.js
4. Thêm **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

## 📂 Cấu trúc dự án

```
src/
├── app/
│   ├── page.tsx                    # Trang chủ / Dashboard
│   ├── layout.tsx                  # Layout chính
│   ├── globals.css                 # CSS toàn cục
│   ├── nhap-lieu/
│   │   └── page.tsx                # Trang nhập liệu
│   ├── ket-qua/
│   │   └── [id]/
│   │       ├── page.tsx            # Trang kết quả (server)
│   │       └── result-content.tsx  # Nội dung kết quả (client)
│   ├── lich-su/
│   │   └── page.tsx                # Trang lịch sử
│   ├── so-sanh/
│   │   ├── page.tsx                # Trang so sánh (server)
│   │   └── comparison-content.tsx  # Nội dung so sánh (client)
│   └── actions/
│       ├── save-session.ts         # Lưu phiên đo mới
│       ├── get-sessions.ts         # Lấy danh sách lịch sử
│       ├── get-session-detail.ts   # Chi tiết 1 lần đo
│       └── get-comparison.ts       # Dữ liệu so sánh
├── components/
│   ├── bottom-nav.tsx              # Navigation mobile
│   └── charts/
│       ├── bar-chart-12.tsx        # Biểu đồ cột 12 kinh
│       ├── threshold-chart.tsx     # Biểu đồ ngưỡng
│       ├── diff-chart.tsx          # Chênh trái-phải
│       ├── summary-chart.tsx       # Tay vs Chân
│       ├── radar-chart.tsx         # Radar 12 kinh
│       ├── comparison-chart.tsx    # So sánh nhiều lần đo
│       └── trend-chart.tsx         # Xu hướng thời gian
├── constants/
│   ├── meridians.ts                # 12 đường kinh cố định
│   └── colors.ts                   # Bảng màu
├── lib/
│   ├── meridian-calculator.ts      # Logic tính toán nghiệp vụ
│   ├── supabase.ts                 # Supabase client
│   └── __tests__/
│       └── meridian-calculator.test.ts  # Unit tests
├── types/
│   └── index.ts                    # TypeScript types
supabase/
├── schema.sql                      # Database schema
└── seed.sql                        # Dữ liệu demo
```

## 🔬 Logic nghiệp vụ

### 12 Đường kinh

| Nhóm | Kinh |
|------|------|
| Tay | TTr, Tâm, 3Tiêu, TBL, ĐTr, Phế |
| Chân | BQ, Thận, Đởm, Vị, Can, Tỳ |

### Công thức tính (giữ đúng 100% Excel)

- **mean** = (trái + phải) / 2
- **diff** = ABS(trái - phải)
- **groupCenter** = (groupMax + groupMin) / 2
- **groupError** = groupRange / 6
- **upperThreshold** = groupCenter + groupError
- **lowerThreshold** = groupCenter - groupError
- **upperLowerDiff** = groupCenter(tay) - groupCenter(chân)

### Quy tắc Hàn / Nhiệt

- value > upperThreshold → **Nhiệt** (đỏ)
- value < lowerThreshold → **Hàn** (xanh)
- Giữa ngưỡng → Bình thường (xám)

### Quy tắc Biểu / Lý

- Cả hai Nhiệt → Lý Nhiệt
- Cả hai Hàn → Lý Hàn
- Một bên → Biểu {state} {bên}
- Hai bên khác → Biểu {state1} Trái, Biểu {state2} Phải

## 📄 License

Private / Internal use only.
