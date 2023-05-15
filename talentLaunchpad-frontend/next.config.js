/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["superio-next.vercel.app", "localhost"],
  },
};

module.exports = nextConfig;
