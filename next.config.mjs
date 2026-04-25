/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // 로컬 MinIO
      { protocol: "http", hostname: "localhost", port: "9100", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "9100", pathname: "/**" },
      // 회사 서버 MinIO (외부 노출 시)
      {
        protocol: "http",
        hostname: "csmakers.iptime.org",
        port: "9100",
        pathname: "/**",
      },
      // 사내망
      {
        protocol: "http",
        hostname: "192.168.0.100",
        port: "9100",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
