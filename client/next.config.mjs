import path from "node:path";

const turboRoot = process.env.TURBOPACK_ROOT
  ? path.resolve(process.env.TURBOPACK_ROOT)
  : path.resolve(process.cwd(), "..");

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    root: turboRoot,
  },
};

export default nextConfig;
