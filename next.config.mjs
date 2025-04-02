/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support MongoDB in Edge Runtime with serverExternalPackages instead of experimental.serverComponentsExternalPackages
  serverExternalPackages: ['mongoose'],
};

export default nextConfig; 
