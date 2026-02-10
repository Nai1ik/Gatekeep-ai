/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    basePath: '/Gatekeep-ai',
    assetPrefix: '/Gatekeep-ai/',
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
