# Hướng Dẫn Xuất Bản Trang Web "Hôm Nay Uống Gì?" Lên Internet (Miễn Phí 100%)

Dự án đã được cấu hình tối ưu để đưa lên các dịch vụ máy chủ đám mây miễn phí tốt nhất hiện nay (Vercel, Netlify, Cloudflare Pages, GitHub Pages) với đầy đủ chứng chỉ bảo mật HTTPS và hỗ trợ tên miền riêng tùy chỉnh.

---

## CÁCH 1 (Khuyên Dùng Nhất): Đưa Lên GitHub & Deploy Bằng Vercel

### Bước 1: Tạo Repository Trên GitHub
1. Mở trình duyệt, truy cập vào [https://github.com/new](https://github.com/new).
2. Đặt tên kho lưu trữ (Repository name): `homnay-uonggi`.
3. Chọn chế độ **Public** (hoặc Private tùy bạn) rồi bấm **Create repository**.

### Bước 2: Đẩy Code Từ Máy Mac Lên GitHub
Mở Terminal trên máy Mac của bạn và chạy các lệnh sau (thay `<tai-khoan-github-cua-ban>` bằng username GitHub của bạn):

```bash
cd /Users/admin/Documents/0.WORK/13.LIO_ECOM/homnay-uonggi
git branch -M main
git remote add origin https://github.com/<tai-khoan-github-cua-ban>/homnay-uonggi.git
git push -u origin main
```

### Bước 3: Đưa Lên Mạng Trực Tuyến Qua Vercel
1. Truy cập [https://vercel.com](https://vercel.com) và bấm **Sign Up** (hoặc Log In) bằng tài khoản **GitHub**.
2. Tại bảng điều khiển Vercel, bấm nút **"Add New..."** ➔ Chọn **"Project"**.
3. Danh sách kho GitHub sẽ hiện ra, tìm `homnay-uonggi` và bấm **"Import"**.
4. Giữ nguyên tất cả cài đặt mặc định (Vercel tự nhận diện Vite + React), bấm nút **"Deploy"**.
5. Sau khoảng 30 giây, Vercel sẽ cấp cho bạn một đường link chính thức (ví dụ: `https://homnay-uonggi.vercel.app`).
   * Bất kỳ ai dùng điện thoại 4G hay máy tính ở bất cứ đâu trên thế giới đều có thể vào chơi mở hòm!
   * Mỗi khi bạn sửa code và gõ `git push`, trang web sẽ tự động cập nhật sau 10 giây!

---

## CÁCH 2 (Nhanh Nhất Không Cần GitHub): Dùng Lệnh Vercel CLI

Nếu bạn muốn có ngay link web trong 1 phút mà không cần tạo tài khoản GitHub:

1. Trong Terminal, chạy lệnh:
   ```bash
   cd /Users/admin/Documents/0.WORK/13.LIO_ECOM/homnay-uonggi
   npx vercel
   ```
2. Đăng nhập qua email hoặc GitHub theo hướng dẫn trên màn hình.
3. Bấm `Enter` để đồng ý các thiết lập mặc định.
4. Terminal sẽ in ra đường dẫn trang web trực tuyến ngay lập tức!

---

## CÁCH 3: Gắn Tên Miền Riêng (Ví dụ: `homnayuonggi.vn` hoặc `.com`)

1. Vào dự án của bạn trên Vercel ➔ Chọn tab **Settings** ➔ **Domains**.
2. Nhập tên miền bạn sở hữu (ví dụ: `homnayuonggi.vn`) và bấm **Add**.
3. Vercel sẽ cung cấp bản ghi DNS (A record hoặc CNAME). Bạn chỉ cần copy dán vào trang quản lý tên miền (như iNet, Mắt Bão, GoDaddy...).
4. Sau 5-15 phút, trang web của bạn sẽ chạy chính thức trên tên miền riêng với ổ khóa xanh HTTPS miễn phí trọn đời!

---

## Cập Nhật Link GitHub & Facebook Cá Nhân Trong Code

Trong file `src/App.tsx`:
* Tìm `href="https://github.com"` ➔ Thay bằng link GitHub của bạn (ví dụ: `https://github.com/username/homnay-uonggi`).
* Nút Facebook hiện tại đã tự động liên kết với tính năng **Chia sẻ bài viết lên Facebook (Facebook Share Dialog)** của người dùng!
