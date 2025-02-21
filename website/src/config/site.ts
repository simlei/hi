export const siteConfig = {
  // Base path for GitHub Pages (repository name)
  basePath: '/hi',
  
  // Full URL for the live site
  baseUrl: 'https://simlei.github.io',
  
  // Function to get the full URL for a path
  getUrl: (path: string = '') => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${siteConfig.baseUrl}${siteConfig.basePath}/${cleanPath}`.replace(/\/+/g, '/');
  }
};