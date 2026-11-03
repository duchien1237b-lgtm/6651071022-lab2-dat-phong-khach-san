# Emerald Stay – Đặt phòng khách sạn & homestay

Lab 2 – Thiết kế Web · **Nguyễn Đức Hiền – MSSV 6651071022**

| Biến thể | Giá trị |
|---|---|
| S = 6+6+5+1+0+7+1+0+2+2 | **30** |
| D = 30 mod 15 | **0** → Đặt phòng khách sạn/homestay (data.json, 24 mục) |
| F = 22 mod 10 | **2** → Form nhiều bước có validate · Toast thông báo · Responsive breakpoint tùy biến |
| C = 6 mod 5 | **1** → Emerald `#059669` |

## Công nghệ
React 18 (Hooks) · TypeScript `strict` · Vite · Tailwind CSS 3 · React Router v6 · useReducer/Context API · ESLint · Vitest.

## Chạy dự án
```bash
npm install
npm run dev        # http://localhost:5173
npx tsc --noEmit   # kiểm tra kiểu
npx eslint .       # lint
npm run test       # unit test
npm run build      # build production vào dist/
```

## Các route
| Route | Trang |
|---|---|
| `/` | Danh sách: tìm kiếm (debounce 300ms), lọc thành phố/loại/giá, sắp xếp |
| `/item/:id` | Chi tiết: thư viện ảnh (modal, Esc, bẫy focus), tiện nghi, phòng, đánh giá |
| `/item/:id/book` | Form đặt phòng 3 bước có validate |
| `/bookings` | Đặt phòng của tôi (localStorage), hủy đặt phòng có hộp thoại xác nhận |

## 3 tính năng bắt buộc (F = 2)
1. **Form nhiều bước có validate**: `src/pages/BookingPage.tsx`, `src/validation.ts`, `src/components/Stepper.tsx`
2. **Toast thông báo**: `src/context/ToastProvider.tsx`, `src/components/Toaster.tsx`, `src/hooks/useToast.ts`
3. **Responsive breakpoint tùy biến**: `tailwind.config.js` (`tablet` 640px, `laptop` 1024px, `desktop` 1280px)

## Triển khai
- **Vercel**: Import repo → Framework “Vite” → Deploy. File `vercel.json` đã cấu hình rewrite cho React Router.
- **Netlify**: Build `npm run build`, publish `dist`. File `public/_redirects` đã có sẵn.

Ảnh minh họa lấy từ Unsplash (Unsplash License). Tên khách sạn/homestay là hư cấu phục vụ bài tập.
