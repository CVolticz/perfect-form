/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['lh3.googleusercontent.com'], // Add the domain here
    },
    experimental: {
        serverActions: true,
    }
};

module.exports = nextConfig;
