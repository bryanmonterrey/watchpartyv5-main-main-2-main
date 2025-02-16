/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["utfs.io"],
    },
    async rewrites() {
        return [
            {
                source: '/api/channel-subscriptions/:path*',
                destination: '/api/channel-subscriptions/:path*',
            },
        ]
    },
};

export default nextConfig;