/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support MongoDB in Edge Runtime with serverExternalPackages instead of experimental.serverComponentsExternalPackages
  serverExternalPackages: ['mongoose'],
  
  // Configure allowed image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  }
};

export default nextConfig; 
