import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allows admin-uploaded hero images (Supabase Storage) to be used with
    // next/image. Uploaded images are currently rendered with
    // `unoptimized`, so this isn't strictly required yet, but keeps the
    // door open for optimized remote images later without another change.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
