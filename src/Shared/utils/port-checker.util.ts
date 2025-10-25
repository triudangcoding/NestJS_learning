import { createServer } from 'net';

/**
 * Kiểm tra xem port có sẵn để sử dụng không
 * @param port - Port cần kiểm tra
 * @returns Promise<boolean> - true nếu port sẵn sàng, false nếu bị chiếm
 */
export function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Tìm port sẵn sàng trong khoảng từ startPort đến endPort
 * @param startPort - Port bắt đầu tìm kiếm
 * @param endPort - Port kết thúc tìm kiếm (mặc định: startPort + 100)
 * @returns Promise<number | null> - Port sẵn sàng hoặc null nếu không tìm thấy
 */
export async function findAvailablePort(
  startPort: number, 
  endPort: number = startPort + 100
): Promise<number | null> {
  for (let port = startPort; port <= endPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  return null;
}

/**
 * Lấy port sẵn sàng với fallback logic
 * @param preferredPort - Port ưu tiên
 * @param fallbackRange - Khoảng port dự phòng (mặc định: 100 ports)
 * @returns Promise<number> - Port sẵn sàng
 * @throws Error nếu không tìm thấy port nào sẵn sàng
 */
export async function getAvailablePort(
  preferredPort: number, 
  fallbackRange: number = 100
): Promise<number> {
  // Kiểm tra port ưu tiên trước
  if (await isPortAvailable(preferredPort)) {
    return preferredPort;
  }

  // Tìm port khác trong khoảng fallback
  const availablePort = await findAvailablePort(
    preferredPort + 1, 
    preferredPort + fallbackRange
  );

  if (availablePort) {
    console.warn(`⚠️  Port ${preferredPort} đã bị chiếm. Sử dụng port ${availablePort} thay thế.`);
    return availablePort;
  }

  throw new Error(
    `Không thể tìm thấy port sẵn sàng trong khoảng ${preferredPort} - ${preferredPort + fallbackRange}`
  );
}
