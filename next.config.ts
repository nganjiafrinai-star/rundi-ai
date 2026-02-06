import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/news-proxy/:path*',
                destination: 'http://192.168.80.15:8004/:path*',
            },
            {
                source: '/api/verbs-proxy/:path*',
                destination: 'http://192.168.80.15:8001/:path*',
            },
            {
                source: '/api/dictionary-proxy/:path*',
                destination: 'http://192.168.80.15:8002/:path*',
            },
            {
                source: '/api/translation-proxy/:path*',
                destination: 'http://192.168.80.15:8003/:path*',
            },
            {
                source: '/api/chat-proxy/:path*',
                destination: 'http://192.168.80.15:800/:path*',
            },
        ]
    },
};

export default nextConfig;
