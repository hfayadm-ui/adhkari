import type { NextConfig } from "next";

const securityHeaders = [
  /* Prevent clickjacking */
  { key: 'X-Frame-Options', value: 'DENY' },
  /* Prevent MIME-type sniffing */
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  /* Enable XSS protection (legacy browsers) */
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  /* Control referrer information */
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  /* HSTS — enforce HTTPS for 1 year, include subdomains */
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  /* Permissions Policy — restrict browser features */
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(), push=(self), notifications=(self)' },
  /* Content Security Policy */
  {
    key: 'Content-Security-Policy',
    value: [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src 'self' https://fonts.gstatic.com data:`,
      `img-src 'self' data: blob: https://lh3.googleusercontent.com https://images.unsplash.com https://*.googleapis.com`,
      `connect-src 'self' https://accounts.google.com https://apis.google.com https://aladhan.com`,
      `frame-src https://accounts.google.com`,
      `worker-src 'self' blob:`,
      `manifest-src 'self'`,
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
    ];
  },
};

export default nextConfig;
