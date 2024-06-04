/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: true,
    reloadOnOnline: true,
    aggressiveFrontEndNavCaching: true,
    disable: false,
    sw: "service-worker.js",
    workboxOptions: {
      disableDevLogs: true,
    },
  });

const nextConfig = {
    reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = {
      "mongodb-client-encryption": false ,
      "aws4": false
    };

    return config;
         },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
}

module.exports = withPWA(nextConfig)
