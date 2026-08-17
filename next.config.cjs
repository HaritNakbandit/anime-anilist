/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  basePath: isProd ? "/anime-anilist" : "",
  output: "export",
  reactStrictMode: true,
};

module.exports = nextConfig;