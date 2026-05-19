/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
