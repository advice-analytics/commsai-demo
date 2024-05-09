// next.config.js

const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'], // Add Firebase Storage hostname here
  },
  async headers() {
    let allowOrigin = process.env.NEXT_PUBLIC_ALLOW_ORIGIN || "*"; // Default to "*" if NEXT_PUBLIC_ALLOW_ORIGIN is not defined

    return [
      {
        // Set CORS headers for all API routes
        source: "/api/:path*", // Match all API routes
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: allowOrigin }, // Use the configured allowOrigin value
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,PATCH,DELETE,OPTIONS" }, // Allow the listed HTTP methods
          { key: "Access-Control-Allow-Headers", value: "*" }, // Allow all headers
        ],
      },
    ];
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
