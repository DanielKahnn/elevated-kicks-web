

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'sneakernews.com' },
      { protocol: 'https', hostname: 'images.footlocker.com' },
      { protocol: 'https', hostname: 'static.nike.com' },
      { protocol: 'https', hostname: 'images.stockx.com' },
    ],
  },
}

export default nextConfig
