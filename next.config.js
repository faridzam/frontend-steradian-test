/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BACKEND: 'http://localhost:8103'
  }
}

module.exports = nextConfig
