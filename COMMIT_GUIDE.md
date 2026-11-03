# Hướng dẫn commit (≥ 14 commit, trải đều trong 5 tiếng)

Đề yêu cầu commit message dạng `[HH:MM] mô tả ngắn` và ít nhất 14 commit trải đều trong 5 tiếng.
**HH:MM là giờ thật lúc bạn commit**, đừng sửa giờ giả. Cứ khoảng 20 phút làm 1 commit là đủ 15 commit trong 5 tiếng.

## Chuẩn bị
1. Giải nén zip ra một thư mục tạm, ví dụ `D:\tam\6651071022_LAB2` (gọi là **NGUỒN**).
2. Trên GitHub tạo repo rỗng tên `6651071022-lab2-hotel-booking`.
3. Tạo thư mục làm việc mới `6651071022_LAB2` (gọi là **REPO**), rồi:
   ```bash
   cd 6651071022_LAB2
   git init
   git branch -M main
   git remote add origin https://github.com/<tai-khoan>/6651071022-lab2-hotel-booking.git
   ```
4. Ở mỗi bước dưới đây: chép đúng các file được liệt kê từ NGUỒN sang REPO (giữ nguyên đường dẫn), chạy thử nếu có ghi chú, rồi commit:
   ```bash
   git add .
   git commit -m "[HH:MM] <mô tả>"
   git push -u origin main
   ```

## Các bước

| # | Chép các file/thư mục này | Gợi ý commit message | Kiểm tra |
|---|---|---|---|
| 1 | `package.json`, `package-lock.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `src/main.tsx`, `src/vite-env.d.ts`, `public/favicon.svg`, `public/robots.txt` | `[HH:MM] Khởi tạo dự án Vite React TypeScript` | `npm install` |
| 2 | `tailwind.config.js`, `postcss.config.js`, `src/index.css` | `[HH:MM] Cài đặt Tailwind và breakpoint tùy biến tablet/laptop/desktop, màu Emerald` | |
| 3 | `eslint.config.js` | `[HH:MM] Cấu hình ESLint thêm 2 rule no-explicit-any và no-console` | |
| 4 | `src/utils.ts`, `src/utils.test.ts` | `[HH:MM] Viết 4 hàm tiện ích và thêm file test được cấp` | `npm run test` |
| 5 | `design/` | `[HH:MM] Thêm wireframe trang danh sách, chi tiết, form đặt phòng` | |
| 6 | `src/types.ts`, `src/data/` | `[HH:MM] Tạo data.json 24 khách sạn và homestay` | |
| 7 | `src/images.ts`, `src/assets/`, `src/components/Icons.tsx`, `src/components/SmartImage.tsx`, `src/components/Rating.tsx` | `[HH:MM] Thêm icon, ảnh có fallback và component đánh giá` | |
| 8 | `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/Layout.tsx`, `src/hooks/useDocumentTitle.ts`, `src/pages/NotFoundPage.tsx` | `[HH:MM] Dựng layout header footer và trang 404` | |
| 9 | `src/components/ListingCard.tsx`, `src/pages/ListPage.tsx` | `[HH:MM] Trang danh sách: lưới responsive, tìm kiếm debounce, lọc và sắp xếp` | |
| 10 | `src/components/Modal.tsx`, `src/pages/DetailPage.tsx` | `[HH:MM] Trang chi tiết và modal xem ảnh (Esc, bẫy focus)` | |
| 11 | `src/context/toastContext.ts`, `src/context/ToastProvider.tsx`, `src/components/Toaster.tsx`, `src/hooks/useToast.ts` | `[HH:MM] Thêm hệ thống Toast thông báo` | |
| 12 | `src/context/bookingContext.ts`, `src/context/BookingProvider.tsx`, `src/hooks/useBookings.ts` | `[HH:MM] Lưu đặt phòng vào localStorage bằng useReducer và Context` | |
| 13 | `src/formStyles.ts`, `src/validation.ts`, `src/components/Field.tsx`, `src/components/Stepper.tsx`, `src/pages/BookingPage.tsx` | `[HH:MM] Form đặt phòng 3 bước có validate` | |
| 14 | `src/pages/MyBookingsPage.tsx`, `src/App.tsx` | `[HH:MM] Trang đặt phòng của tôi, hủy có xác nhận và cấu hình route` | `npm run dev` |
| 15 | `vercel.json`, `public/_redirects`, `README.md` | `[HH:MM] Cấu hình deploy Vercel/Netlify và viết README` | `npx tsc --noEmit`, `npx eslint .`, `npm run build` |
| 16 | (sau khi deploy) sửa link web trong `README.md` | `[HH:MM] Cập nhật link deploy` | |

> Lưu ý: ở các bước 1–13 web có thể chưa chạy đầy đủ vì `App.tsx` được thêm ở bước 14; điều đó bình thường.
> Nếu muốn mỗi commit đều build được, hãy chép `src/App.tsx` ngay ở bước 1 và sửa dần các route theo từng bước.

## Deploy lên Vercel
1. Vào https://vercel.com → đăng nhập bằng GitHub → **Add New → Project** → chọn repo vừa tạo.
2. Framework Preset: **Vite** (tự nhận). Build command `npm run build`, Output `dist`. Bấm **Deploy**.
3. Mở link `https://<ten>.vercel.app`, thử vào thẳng `/bookings` và F5 để chắc chắn không lỗi 404.

## Chụp ảnh 4 lệnh kiểm tra (trên máy bạn)
- `npx tsc --noEmit` · `npx eslint .` · `npm run test`
- Lighthouse: mở link đã deploy trong Chrome ẩn danh → F12 → tab **Lighthouse** → Mode *Navigation*, Device **Mobile** → *Analyze page load*.
