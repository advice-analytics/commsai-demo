// next.config.js

const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'], // Add Firebase Storage hostname here
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Rewrite API routes
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*" // Proxy to local development server
            : "/api/:path*", // Direct to production API endpoint
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/docs" // Proxy to local development server
            : "/api/docs", // Direct to production API endpoint
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/openapi.json" // Proxy to local development server
            : "/api/openapi.json", // Direct to production API endpoint
      },
    ];
  },
};

module.exports = nextConfig;
