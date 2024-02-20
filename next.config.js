/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
            config.externals = [...config.externals, 'bcrypt'];
            config.resolve.fallback = {
                "mongodb-client-encryption": false ,
                "aws4": false
              }
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

module.exports = nextConfig
