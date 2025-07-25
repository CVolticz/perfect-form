/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['lh3.googleusercontent.com'], // Add the domain here
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb', // Adjust this value as needed (e.g., '1gb', '500mb')
        }
    }
};

module.exports = nextConfig;
