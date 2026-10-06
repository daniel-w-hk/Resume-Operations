import type { NextConfig } from "next";
import variant from "./site-variant.json";

const basePath = `/${variant.repository}`;

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_SITE_REPOSITORY: variant.repository,
  },
  images: {
    unoptimized: true,
  },

  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.bib$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default function config(phase: string): NextConfig {
  return {
    ...nextConfig,
    // Development and export builds can run without overwriting each other's files.
    distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
  };
}
