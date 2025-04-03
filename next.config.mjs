/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support MongoDB in Edge Runtime with serverExternalPackages instead of experimental.serverComponentsExternalPackages
  serverExternalPackages: ['mongoose'],
  
  // Configure allowed image domains
  images: {
    domains: [
      'perfectpetinsurance.co.uk',
      'images.unsplash.com',
      'placekitten.com',
      'placehold.co',
      'picsum.photos',
      'via.placeholder.com',
      'example.com'
    ],
  }
};

export default nextConfig; 
