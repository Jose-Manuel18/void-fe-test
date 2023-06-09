const { hostname } = require("os")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "media.valorant-api.com",
      },
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/valorant",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
