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
      // --- Ini bagian yang baru ditambahkan untuk Supabase ---
      {
        protocol: "https",
        hostname: "yrcgxyozneomuikomlgc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // ------------------------------------------------------
    ],
  },
};

export default nextConfig;