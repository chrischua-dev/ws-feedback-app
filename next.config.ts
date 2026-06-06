import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure aws-amplify packages are transpiled correctly
  transpilePackages: ["aws-amplify", "@aws-amplify/core", "@aws-amplify/data"],
};

export default nextConfig;
