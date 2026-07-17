import type { NextConfig } from "next";

const isGithubPagesExport = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/rota-zero-assistente-financeiro";

const nextConfig: NextConfig = {
  ...(isGithubPagesExport
    ? {
        output: "export",
        basePath: repoBasePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
