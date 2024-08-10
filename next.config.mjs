/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/", // The route that is accessed first (e.g., the homepage)
        destination: "/login", // The route you want to redirect to
        permanent: true, // Set to true for a 308 permanent redirect, false for a 307 temporary redirect
      },
    ];
  },
};

export default nextConfig;
