/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  // Required for GitHub Pages unless you setup a custom domain
  basePath: process.env.NODE_ENV === 'production' ? '/FintrackAi' : '',
  images: {
    unoptimized: true, // Next.js Image Optimization API doesn't work in static export
  },
  experimental: {
    // Attempting to disable turbopack if it's causing the crash
    // In Next 15/16 this might be handled via flags but let's try setting some options
  }
};

export default nextConfig;
