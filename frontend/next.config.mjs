/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  /* config options here */
  experimental: {
    // Attempting to disable turbopack if it's causing the crash
    // In Next 15/16 this might be handled via flags but let's try setting some options
  }
};


export default nextConfig;
