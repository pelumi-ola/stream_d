/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.scorebat.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
