/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/hi' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? '/hi' : '',
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' ? 'https://simlei.github.io' : 'http://localhost:3000'
  }
}

module.exports = nextConfig