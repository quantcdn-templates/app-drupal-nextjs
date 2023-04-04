/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN],
    minimumCacheTTL: 2592000,
  },
}

module.exports = nextConfig
