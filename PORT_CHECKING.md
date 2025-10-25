# Port Checking Feature

## Tổng quan
Tính năng này tự động kiểm tra và tìm port sẵn sàng khi port mặc định bị chiếm.

## Cách hoạt động

### 1. Kiểm tra Port
- Ứng dụng sẽ kiểm tra port được cấu hình trong `PORT` environment variable
- Nếu port đó sẵn sàng, ứng dụng sẽ sử dụng port đó
- Nếu port bị chiếm, ứng dụng sẽ tìm port khác trong khoảng `PORT_FALLBACK_RANGE`

### 2. Cấu hình Environment Variables

```bash
# Port mặc định
PORT=9934

# Khoảng port dự phòng (mặc định: 100)
PORT_FALLBACK_RANGE=100
```

### 3. Ví dụ hoạt động

**Trường hợp 1: Port sẵn sàng**
```
🚀 Server đang khởi động trên port 9934
✅ Server đã sẵn sàng tại http://localhost:9934
```

**Trường hợp 2: Port bị chiếm**
```
⚠️  Port 9934 đã bị chiếm. Sử dụng port 9935 thay thế.
🚀 Server đang khởi động trên port 9935
✅ Server đã sẵn sàng tại http://localhost:9935
```

**Trường hợp 3: Không tìm thấy port sẵn sàng**
```
❌ Không thể khởi động server: Không thể tìm thấy port sẵn sàng trong khoảng 9934 - 10034
```

## API Functions

### `isPortAvailable(port: number): Promise<boolean>`
Kiểm tra xem port có sẵn sàng không.

### `findAvailablePort(startPort: number, endPort?: number): Promise<number | null>`
Tìm port sẵn sàng trong khoảng từ startPort đến endPort.

### `getAvailablePort(preferredPort: number, fallbackRange?: number): Promise<number>`
Lấy port sẵn sàng với fallback logic.

## Lợi ích

1. **Tự động hóa**: Không cần can thiệp thủ công khi port bị chiếm
2. **Linh hoạt**: Có thể cấu hình khoảng port dự phòng
3. **Thông báo rõ ràng**: Hiển thị port đang sử dụng và cảnh báo khi chuyển port
4. **Error handling**: Xử lý lỗi khi không tìm thấy port sẵn sàng

## Sử dụng trong Development

```bash
# Chạy với port mặc định
npm run start:dev

# Chạy với port tùy chỉnh
PORT=3000 npm run start:dev

# Chạy với khoảng port dự phòng tùy chỉnh
PORT=3000 PORT_FALLBACK_RANGE=50 npm run start:dev
```
