/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [],
        formats: ['image/avif', 'image/webp'],
    },
    experimental: {},
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { isServer }) => {
        // Fix for file watching issues on network drives
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
            ignored: /node_modules/,
        }
        return config
    },
}

module.exports = nextConfig
