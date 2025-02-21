/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Enable React strict mode for improved error handling.
   */
  reactStrictMode: true,

  /**
   * Enable static exports for GitHub Pages deployment.
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: 'export',

  /**
   * Set base path. This is the slug of your repository.
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "/hi",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig