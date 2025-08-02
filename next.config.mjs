/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts"],
  eslint: { ignoreDuringBuilds: true },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    BASE_DOMAIN: process.env.BASE_DOMAIN,
    ENABLE_NOTIFICATION: process.env.ENABLE_NOTIFICATION
  },
  images: { domains: [process.env.BASE_DOMAIN], },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: `${process.env.SERVICE_URL}/api/:path*`
    },
    {
      source: '/Uploads/:path*',
      destination: `${process.env.SERVICE_URL}/Uploads/:path*`
    }
    ];
  }
};

export default nextConfig;
