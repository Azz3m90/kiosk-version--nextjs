# Deployment Guide

This guide covers deploying the Restaurant Kiosk application to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Images optimized
- [ ] Error tracking set up
- [ ] Analytics configured
- [ ] Payment gateway integrated (if applicable)
- [ ] Security audit completed
- [ ] Performance audit completed
- [ ] Accessibility audit completed
- [ ] Documentation updated

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Cloud)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Environment Variables:

Set in Vercel Dashboard → Project Settings → Environment Variables

#### Custom Domain:

Vercel Dashboard → Project Settings → Domains

### Option 2: Self-Hosted (Recommended for Kiosks)

For physical kiosks, self-hosting provides better control and reliability.

#### Requirements:

- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate

#### Steps:

1. **Build the Application**

   ```bash
   npm run build
   ```

2. **Install PM2**

   ```bash
   npm install -g pm2
   ```

3. **Create PM2 Ecosystem File**

   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [
       {
         name: "restaurant-kiosk",
         script: "npm",
         args: "start",
         env: {
           NODE_ENV: "production",
           PORT: 3000,
         },
         instances: 1,
         autorestart: true,
         watch: false,
         max_memory_restart: "1G",
       },
     ],
   };
   ```

4. **Start with PM2**

   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### Option 3: Docker Deployment

Containerize the application for consistent deployment.

#### Dockerfile:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml:

```yaml
version: "3.8"

services:
  kiosk:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
```

#### Deploy:

```bash
docker-compose up -d
```

### Option 4: Static Export (Limited Features)

For simple deployments without server-side features.

#### Steps:

1. **Update next.config.js**

   ```javascript
   module.exports = {
     output: "export",
   };
   ```

2. **Build**

   ```bash
   npm run build
   ```

3. **Deploy `out/` directory** to any static hosting:
   - Netlify
   - GitHub Pages
   - AWS S3
   - Azure Static Web Apps

**Note**: This disables server-side features like API routes.

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
# Application
NEXT_PUBLIC_APP_NAME="Restaurant Kiosk"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Kiosk Settings
NEXT_PUBLIC_IDLE_TIMEOUT=90000
NEXT_PUBLIC_WARNING_TIMEOUT=30000
NEXT_PUBLIC_DEFAULT_LANGUAGE="en"

# Tax Configuration
NEXT_PUBLIC_TAX_RATE=0.085

# Payment Gateway
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN="https://..."
SENTRY_AUTH_TOKEN="..."

# Feature Flags
NEXT_PUBLIC_ENABLE_IDLE_TIMER=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true

NODE_ENV=production
```

## 🔒 Security Hardening

### 1. HTTPS Configuration

**Always use HTTPS in production**

```bash
# Let's Encrypt (Free)
sudo certbot --nginx -d your-domain.com

# Or use Cloudflare for SSL
```

### 2. Security Headers

Add to `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
```

### 3. Rate Limiting

Implement rate limiting for API routes (if any):

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimit = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? "unknown";
  const limit = 100; // requests per minute
  const windowMs = 60000; // 1 minute

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 0, resetTime: Date.now() + windowMs });
  }

  const ipData = rateLimit.get(ip);

  if (Date.now() > ipData.resetTime) {
    ipData.count = 0;
    ipData.resetTime = Date.now() + windowMs;
  }

  ipData.count++;

  if (ipData.count > limit) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  return NextResponse.next();
}
```

## 📊 Monitoring Setup

### 1. Error Tracking with Sentry

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 2. Analytics with Google Analytics

```typescript
// lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const pageview = (url: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: any) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

### 3. Uptime Monitoring

**Recommended Services**:

- Pingdom
- UptimeRobot
- StatusCake
- New Relic

**Setup Health Check Endpoint**:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## 🧪 Post-Deployment Testing

### Automated Tests

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y

# Run performance tests
npm run test:perf
```

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Language switching works
- [ ] Food menu displays and filters work
- [ ] Drinks menu displays and filters work
- [ ] Add to cart functionality
- [ ] Cart sidebar opens and closes
- [ ] Item customization modal
- [ ] Order review page
- [ ] Payment form validation
- [ ] Payment processing (test mode)
- [ ] Idle timer triggers correctly
- [ ] Error boundary catches errors
- [ ] Mobile responsiveness
- [ ] Touch interactions
- [ ] All translations present

## 🔧 Troubleshooting

### Common Issues

**Build Fails**

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**Port Already in Use**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Environment Variables Not Loading**

- Check `.env.production` exists
- Verify variable names start with `NEXT_PUBLIC_` for client-side
- Restart dev server after changes

**Images Not Loading**

- Check `next.config.js` image domains
- Verify images are in `public/` directory
- Check file permissions

## 📱 Kiosk-Specific Deployment

### Hardware Setup

1. **Install Operating System**

   - Ubuntu 22.04 LTS (recommended)
   - Windows 10/11 IoT Enterprise
   - Chrome OS Flex

2. **Configure Kiosk Mode**

   ```bash
   # Ubuntu - Auto-start browser in kiosk mode
   sudo nano /etc/xdg/autostart/kiosk.desktop
   ```

   ```ini
   [Desktop Entry]
   Type=Application
   Name=Kiosk
   Exec=chromium-browser --kiosk --no-first-run --disable-infobars http://localhost:3000
   ```

3. **Disable Sleep/Screensaver**

   ```bash
   # Ubuntu
   gsettings set org.gnome.desktop.session idle-delay 0
   ```

4. **Auto-restart on Crash**
   - Use PM2 with `autorestart: true`
   - Configure watchdog timer in BIOS

### Network Configuration

- **Static IP**: Assign static IP for reliability
- **Firewall**: Only allow necessary ports (80, 443, 3000)
- **VPN**: Use VPN for remote management
- **Backup Connection**: Configure 4G/5G backup

## 📞 Support & Maintenance

### Monitoring Dashboard

Set up a dashboard to monitor:

- Application uptime
- Error rates
- Order completion rate
- Average order time
- Payment success rate

### Regular Maintenance

**Daily**:

- Check error logs
- Verify payment processing
- Monitor uptime

**Weekly**:

- Review analytics
- Update menu items
- Check for updates

**Monthly**:

- Security audit
- Performance review
- Hardware inspection
- Backup verification

### Emergency Contacts

Document and share:

- Technical support contact
- Payment gateway support
- Hosting provider support
- Hardware vendor support

## 🎉 Launch Checklist

- [ ] Application deployed and accessible
- [ ] SSL certificate installed and valid
- [ ] Environment variables configured
- [ ] Payment gateway in production mode
- [ ] Analytics tracking verified
- [ ] Error tracking configured
- [ ] Monitoring alerts set up
- [ ] Backup system tested
- [ ] Staff trained
- [ ] Documentation provided
- [ ] Emergency procedures documented
- [ ] Support contacts shared

---

**Congratulations on your deployment! 🚀**

For issues or questions, refer to the main README.md or contact support.
