/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-checkbox',
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
