# Sitemap Configuration

This project uses a custom sitemap generator that automatically creates a sitemap.xml with both static and dynamic routes from the backend API.

## Files

- `scripts/generate-sitemap.js` - Custom script that fetches routes from the API
- `public/sitemap.xml` - Generated sitemap (auto-generated, don't edit manually)
- `public/robots.txt` - Generated robots.txt (auto-generated, don't edit manually)
- `public/_headers` - Netlify headers configuration
- `netlify.toml` - Netlify build and deployment configuration

## How it Works

1. The script fetches all bus packages from `https://api.sightseeingroma.com/packages/`
2. It combines static routes with dynamic package routes
3. Generates a properly formatted XML sitemap with priorities and change frequencies
4. Also generates a robots.txt file with sitemap reference

## Usage

### Generate Sitemap Manually
```bash
npm run generate-sitemap
```

### Build with Fresh Sitemap (REQUIRED for Production)
```bash
npm run build:sitemap
```

This will:
1. Fetch latest data from the API
2. Generate fresh sitemap.xml and robots.txt
3. Build the project with updated sitemap in the dist folder

**IMPORTANT**: Always use `npm run build:sitemap` before uploading to Netlify to ensure your sitemap is up-to-date with the latest packages.

### Regular Build (Not Recommended)
```bash
npm run build
```
This builds without updating the sitemap.

## Configuration

Edit `scripts/generate-sitemap.js` to customize:

- `BASE_URL` - Your website URL
- `API_URL` - Your backend API URL
- `staticRoutes` - Static routes with priorities and change frequencies
- `excludedRoutes` - Routes to exclude from sitemap

## Sitemap Structure

- **Homepage**: Priority 1.0, daily updates
- **Compare Tickets**: Priority 0.9, daily updates
- **About/Terms/Policy**: Priority 0.5-0.7, monthly/yearly updates
- **Package Pages**: Priority 0.8, weekly updates

## Deployment Workflow (Manual Upload to Netlify)

1. **Generate sitemap and build**:
   ```bash
   npm run build:sitemap
   ```

2. **Verify the dist folder contains**:
   - `dist/sitemap.xml`
   - `dist/robots.txt`
   - `dist/_headers`

3. **Upload to Netlify**:
   - Drag and drop the entire `dist` folder to Netlify

4. **Wait for deployment** and verify

## Testing

After uploading the dist folder to Netlify, verify your sitemap at:
- https://www.sightseeingroma.com/sitemap.xml
- Test with Google Search Console: https://search.google.com/search-console

## Troubleshooting

If sitemap shows as plain text:
1. Check that `_headers` or `netlify.toml` is deployed
2. Verify Content-Type header is set to `application/xml`
3. Clear browser cache and reload

If routes are missing:
1. Check API is accessible from build environment
2. Verify package data structure in backend
3. Check console logs during `npm run generate-sitemap`
