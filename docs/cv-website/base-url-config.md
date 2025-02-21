# Base URL Configuration

This document describes how the website's base URL is configured across different environments (development and production/GitHub Pages).

## Overview

The base URL configuration is managed through:
1. Next.js configuration (`next.config.js`)
2. Environment variables
3. Shell scripts that set up the environment

## Configuration Files

### 1. Next.js Configuration (`next.config.js`)
```javascript
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/hi' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? '/hi' : '',
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://simlei.github.io' 
      : 'http://localhost:3000'
  }
}
```

### 2. Environment Setup (`scripts/lib/env.sh`)
```bash
# Function to detect GitHub Pages environment
is_github_pages() {
    [[ -n "${GITHUB_ACTIONS:-}" ]] && return 0
    return 1
}

# Function to get the base path
get_base_path() {
    if is_github_pages || [[ "${NODE_ENV:-}" == "production" ]]; then
        echo "/hi"  # Fixed base path for production
    else
        echo ""  # Empty for local development
    fi
}

# Function to get the base URL
get_base_url() {
    if is_github_pages; then
        echo "https://simlei.github.io"
    else
        echo "http://localhost:${1:-3000}"
    fi
}
```

## How It Works

### Development Environment
1. The development server (`scripts/dev.sh`) sets up the environment:
   ```bash
   # Environment variables for development
   NEXT_PUBLIC_BASE_PATH=""
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```
2. URLs are served from the root path (e.g., `http://localhost:3000/`)

### Production/GitHub Pages
1. GitHub Actions workflow sets `NODE_ENV=production`
2. This triggers:
   - Base path: `/hi`
   - Base URL: `https://simlei.github.io`
3. URLs are served under the base path (e.g., `https://simlei.github.io/hi/`)

### Environment Detection
- GitHub Pages environment is detected via `GITHUB_ACTIONS` environment variable
- Production mode is detected via `NODE_ENV=production`
- Local development is assumed when neither condition is true

### URL Construction
1. Internal links use the `NEXT_PUBLIC_BASE_PATH`:
   ```jsx
   <Link href={`${process.env.NEXT_PUBLIC_BASE_PATH}/about`}>About</Link>
   ```

2. API calls use the full `NEXT_PUBLIC_BASE_URL`:
   ```jsx
   const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PATH}/api/data`;
   ```

## Testing
The base URL configuration is verified during deployment:
```bash
# Test URLs in development
http://localhost:3000/          # Development
http://localhost:3000/about     # Development

# Test URLs in production
https://simlei.github.io/hi/         # Production
https://simlei.github.io/hi/about    # Production
```