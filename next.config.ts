import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
    reactStrictMode: process.env.NEXT_ENV === "dev",
    compress: true,
    env: {
        NEXT_ENV: process.env.NEXT_ENV,
        API_URL: process.env.API_URL,
        NODE_ENV: process.env.NODE_ENV,
    },
    output: isGithubPages ? "export" : undefined,
    basePath: isGithubPages ? "/van-calendar" : "",
    images: {
        unoptimized: isGithubPages,
    },
};

export default nextConfig;
