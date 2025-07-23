import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: process.env.NEXT_ENV === "dev",
    env: {
        NEXT_ENV: process.env.NEXT_ENV,
        API_URL: process.env.API_URL,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    compress: true,
    bundlePagesRouterDependencies: true,
};

export default nextConfig;
