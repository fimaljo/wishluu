import type { NextConfig } from "next";
import { securityHeaders } from './src/lib/security';

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: Object.entries(securityHeaders).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ];
  },
  
  // Security configurations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable compression
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Image optimization
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features (optional)
  experimental: {
    // Enable if you want to use the new app router features
    // appDir: true,
  },
};

export default nextConfig;
