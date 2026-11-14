import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  // La vista previa abre el servidor como 127.0.0.1. Sin esto, Next
  // bloquea los scripts y la tabla se queda en «Abriendo…».
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
