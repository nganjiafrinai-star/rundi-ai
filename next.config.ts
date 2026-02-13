import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/news-proxy/:path*',
                destination: 'http://192.168.1.223:8004/:path*',
            },
            {
                source: '/api/verbs-proxy/:path*',
                destination: 'http://192.168.1.223:8001/:path*',
            },
            {
                source: '/api/dictionary-proxy/:path*',
                destination: 'http://192.168.1.223:8002/:path*',
            },
            {
                source: '/api/translation-proxy/:path*',
                destination: 'http://192.168.1.223:8003/:path*',
            },
            {
                source: '/api/chat-proxy/:path*',
                destination: 'http://192.168.1.223:800/:path*',
            },
        ]
    },
};

export default nextConfig;
