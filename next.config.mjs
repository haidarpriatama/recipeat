/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "d12man5gwydfvl.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "yrcgxyozneomuikomlgc.supabase.co",
      },
    ],
  },
};

export default nextConfig;
