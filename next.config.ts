import type { NextConfig } from "next";

// ARTIFACT=1 builds a static export (out/) that scripts/build-artifact.mjs
// inlines into one HTML file for the claude.ai artifact.
const artifact = process.env.ARTIFACT === "1";

const nextConfig: NextConfig = artifact
  ? {
      output: "export",
      images: { unoptimized: true },
      // Pages other than "/" don't exist inside the artifact.
      env: { NEXT_PUBLIC_ARTIFACT: "1" },
    }
  : {
      cacheComponents: true,
      partialPrefetching: true,
    };

export default nextConfig;
