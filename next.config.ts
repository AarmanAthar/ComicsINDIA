/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "huhblzxjlmipoozndffk.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;