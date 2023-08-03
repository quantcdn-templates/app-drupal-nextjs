/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', process.env.NEXT_PUBLIC_IMAGE_DOMAIN],
    minimumCacheTTL: 2592000,
    unoptimized: true
  },
  eslint: {
    // The linting process runs in CI rather than during build.
    ignoreDuringBuilds: true,
  },
  generateBuildId: async () => {
    return 'quant-static'
  },
}

module.exports = nextConfig
