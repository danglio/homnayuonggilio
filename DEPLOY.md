# Hướng Dẫn Xuất Bản Trang Web "Hôm Nay Uống Gì?" Lên GitHub & Internet (Miễn Phí 100%)

Dự án đã được cấu hình tối ưu để đưa lên GitHub của bạn (`danglio/homnayuonggilio`) và các dịch vụ lưu trữ đám mây miễn phí tốt nhất (GitHub Pages, Vercel, Netlify) với đầy đủ chứng chỉ bảo mật HTTPS.

---

## 🚀 CÁCH 1: Đẩy Lên GitHub Của Bạn (`danglio/homnayuonggilio`)

### Bước 1: Tạo Repository Mới Trên GitHub
1. Mở trình duyệt web và vào: **[https://github.com/new](https://github.com/new)**
2. Nhập **Repository name**: `homnayuonggilio`
3. Đặt trạng thái: **Public**
4. ⚠️ **Lưu ý quan trọng**: Không tick chọn *"Add a README file"*, *"Add .gitignore"* hay *"Choose a license"* (vì dự án trên máy bạn đã có sẵn đầy đủ rồi).
5. Bấm nút xanh **Create repository**.

### Bước 2: Đẩy Mã Nguồn Lên GitHub
Mở Terminal trên máy Mac của bạn và chạy 2 câu lệnh sau:

```bash
cd /Users/admin/Documents/0.WORK/13.LIO_ECOM/homnay-uonggi
git remote add origin https://github.com/danglio/homnayuonggilio.git
git push -u origin main
```

*(Nếu GitHub yêu cầu đăng nhập qua Terminal, bạn chỉ cần nhập Personal Access Token (PAT) hoặc làm theo hướng dẫn xác thực trình duyệt của GitHub).*

---

## 🌐 CÁCH 2: Tự Động Bật GitHub Pages (Có Link Web Ngay Trên GitHub)

Sau khi đã đẩy code lên GitHub ở Bước 2:
1. Vào trang repository: `https://github.com/danglio/homnayuonggilio`
2. Bấm vào tab **Settings** (ở trên cùng bên phải) ➔ chọn mục **Pages** ở thanh bên trái.
3. Ở phần **Build and deployment** ➔ mục **Source**: chọn **GitHub Actions**.
4. Dự án đã có sẵn file workflow tự động `.github/workflows/deploy.yml`. Khi bạn push code, GitHub sẽ tự động build và cấp link trang web trực tuyến:
   👉 **`https://danglio.github.io/homnayuonggilio/`**
5. Bạn có thể copy link này gửi ngay cho bạn bè trên Facebook hoặc Zalo!

---

## ⚡ CÁCH 3 (Khuyên Dùng): Kết Nối Vercel Để Có Tên Miền Đẹp Siêu Tốc

1. Truy cập **[https://vercel.com](https://vercel.com)** ➔ Đăng nhập bằng tài khoản **GitHub** của bạn (`danglio`).
2. Bấm **"Add New..."** ➔ Chọn **"Project"**.
3. Vercel sẽ liệt kê các repo của bạn, bấm **"Import"** cạnh repo `homnayuonggilio`.
4. Bấm nút **"Deploy"** (không cần thay đổi gì thêm).
5. Sau 20-30 giây, bạn sẽ có ngay địa chỉ web toàn cầu:
   👉 **`https://homnayuonggilio.vercel.app`**
   * Tự động cập nhật mỗi khi bạn push code mới.
   * Tốc độ tải cực nhanh tại Việt Nam.

---

## 📱 Các Liên Kết Đã Được Cài Đặt Sẵn Trong Ứng Dụng:
- **Logo ứng dụng**: Đã tạo logo 3D neon ly nước trà sữa phát sáng tuyệt đẹp (`/logo.png`, `/favicon.png`).
- **Nút GitHub**: Trỏ trực tiếp đến `https://github.com/danglio/homnayuonggilio`.
- **Nút Facebook**: Trỏ trực tiếp đến trang cá nhân của bạn: `https://www.facebook.com/share/1BjrRKK3nE/?mibextid=wwXIfr`.
- **Hiệu ứng**: Đầy đủ 2 chế độ (Vòng quay CS2 roulette & Mở thẻ FIFA Walkout 3D đường hầm, pháo lửa, quốc kỳ, vị trí thẻ).
