/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow all HTTPS image sources.
      // Recipe images are admin-submitted from arbitrary CDNs (Unilever, Unsplash,
      // Supabase Storage, Google, etc.) — we can't enumerate all domains statically.
      // HTTP is intentionally excluded to block insecure image loading.
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
