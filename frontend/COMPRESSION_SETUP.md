# Text Compression Setup

This project has been configured with comprehensive text compression to improve performance and reduce bandwidth usage.

## What's Been Implemented

### 1. Vite Build Compression
- **Gzip compression** for all text-based assets during build
- **Brotli compression** for modern browsers (better compression than gzip)
- **Code splitting** with manual chunks for better caching
- **Development server compression** enabled

### 2. Production Server
- **Express.js server** with compression middleware
- **Automatic compression** for all responses
- **Proper cache headers** for static assets
- **Client-side routing support**

### 3. Apache Configuration
- **`.htaccess` file** with compression rules
- **Cache headers** for static assets
- **URL rewriting** for SPA routing

## How to Use

### Development
```bash
yarn dev
```
The development server now serves compressed assets automatically.

### Production Build
```bash
# Build with compression
yarn build

# Start production server with compression
yarn start

# Or build and start in one command
yarn build:prod
```

### Deployment Options

#### Option 1: Express Server (Recommended)
```bash
yarn build
yarn start
```

#### Option 2: Apache Server
1. Build your project: `yarn build`
2. Upload the `dist` folder and `.htaccess` file to your Apache server
3. Ensure `mod_deflate` and `mod_expires` are enabled

#### Option 3: Nginx Server
Add this to your nginx configuration:
```nginx
location / {
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    try_files $uri $uri/ /index.html;
}
```

## Expected Performance Improvements

- **Estimated savings**: ~5,724 KiB (as reported by Lighthouse)
- **Faster page loads** due to reduced transfer sizes
- **Better Core Web Vitals** scores
- **Reduced bandwidth costs**

## Verification

To verify compression is working:

1. **Check Network tab** in browser dev tools
2. **Look for `Content-Encoding: gzip`** in response headers
3. **Compare file sizes** - compressed files should be significantly smaller
4. **Run Lighthouse audit** - Text compression should now pass

## Troubleshooting

### Compression not working?
1. Ensure you're using the production build (`yarn build`)
2. Check if your hosting provider supports compression
3. Verify the `.htaccess` file is in the correct location (for Apache)

### Server not starting?
1. Make sure all dependencies are installed: `yarn install`
2. Check if port 3000 is available
3. Try a different port: `PORT=8080 yarn start`

## Additional Optimizations

The setup also includes:
- **Code splitting** for better caching
- **Cache headers** for static assets
- **ETags** for efficient caching
- **Manual chunks** for vendor libraries 