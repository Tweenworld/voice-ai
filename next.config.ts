import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: [
    "@prisma/orm-postgres",
    "@prisma/orm-target-postgres",
    "pg",
  ],
};

export default nextConfig;
