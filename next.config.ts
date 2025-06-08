import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        //pathname: "a"
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
