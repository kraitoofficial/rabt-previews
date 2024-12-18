# Comprehensive Rabt Deployment Guide

## Initial Setup

### 1. System Requirements Verification

1. Check Node.js version:
   ```bash
   node --version  # Must be v20 or later
   ```
2. Verify package manager installation:
   ```bash
   npm --version  # or
   pnpm --version
   ```

### 2. MongoDB Setup

1. Choose deployment option:

   - **Option A: Local MongoDB**

     1. Install MongoDB Community Edition
     2. Start MongoDB service
     3. Create database and user
     4. Get connection string in format: `mongodb://username:password@localhost:27017/database`

   - **Option B: MongoDB Atlas**
     1. Create account at mongodb.com
     2. Create new cluster (M2 recommended for <100 users)
     3. Set up database access (username/password)
     4. Whitelist IP addresses
     5. Get connection string from Atlas dashboard

### 3. Email Server Configuration

1. **Gmail Setup** (Recommended for starting):
   1. Enable 2-Factor Authentication
   2. Generate App Password
   3. Use following settings:
      ```
      SMTP_HOST=smtp.gmail.com
      SMTP_PORT=587
      SMTP_USER=your-gmail@gmail.com
      SMTP_PASSWORD=your-app-password
      ```

### 4. OAuth Configuration

1. **Google OAuth**:

   1. Go to Google Cloud Console
   2. Create new project
   3. Enable OAuth 2.0
   4. Configure OAuth consent screen
   5. Create credentials
   6. Save Client ID and Secret

2. **Facebook OAuth**:
   1. Go to Facebook Developers
   2. Create new app
   3. Add Facebook Login
   4. Configure OAuth settings
   5. Save App ID and Secret

## Customization

### 5. Customizing Your Installation

#### Logo Customization

1. **Logo Requirements**:

   - Container size: 128px × 32px (w-32 h-8)
   - Aspect ratio: 4:1 (recommended)
   - Minimum resolution: 256px × 64px (2x for retina displays)
   - Optimal resolution: 512px × 128px (4x)
   - Format: Provide both light and dark versions for theme support

2. **Logo Placement**:

   - Place your logo files in the `public/logo` directory
   - Recommended filenames:
     ```
     logo-light.png  # for light theme
     logo-dark.png   # for dark theme
     ```

3. **Update Header Component**:
   - Navigate to `components/theme/Header.tsx`
   - Update the Image `src` prop with your logo paths
   - The Next.js Image component with `fill` and `object-contain` will automatically handle scaling

#### Splash Screen Customization

1. To change the loading screen title:
   - Open `components/theme/SplashScreen.tsx`
   - Locate the h1 element with "Rabt Contact Directory"
   - Replace with your desired application name

## Deployment Methods

### Method 1: Vercel Deployment

#### Pre-deployment Setup

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Create `.env` file with all required variables
3. Verify project structure follows Vercel requirements

#### Deployment Steps

1. Login to Vercel:

   ```bash
   vercel login
   ```

2. Initial deployment:

   ```bash
   vercel
   ```

3. Configure environment variables:

   1. Open Vercel dashboard
   2. Go to Project Settings
   3. Navigate to Environment Variables
   4. Import `.env` file or add manually
   5. Verify all required variables are set

4. Production deployment:
   ```bash
   vercel --prod
   ```

### Method 2: Docker Deployment

#### Pre-deployment Setup

1. Install Docker:

   ```bash
   # Ubuntu
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Verify installation
   docker --version
   ```

#### Configuration Files

1. Create `docker-compose.yml`:

```yaml
services:
  app:
    image: ghcr.io/kraito/rabt:latest
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      # Database
      MONGODB_URI: "mongodb://username:password@localhost:27017/database"
      DB_ADMIN_EMAIL: "admin@example.com"

      # Email Configuration
      SMTP_HOST: "smtp.example.com"
      SMTP_PORT: "587"
      SMTP_USER: "your-smtp-user"
      SMTP_PASSWORD: "your-smtp-password"
      SMTP_FROM: "noreply@example.com"

      # NextAuth Configuration
      NEXTAUTH_URL: "http://localhost:3000"
      NEXTAUTH_SECRET: "your-nextauth-secret"

      # Google OAuth
      GOOGLE_CLIENT_ID: ""
      GOOGLE_CLIENT_SECRET: ""

      # Facebook OAuth
      FACEBOOK_CLIENT_ID: ""
      FACEBOOK_CLIENT_SECRET: ""

      # Application
      NODE_ENV: "production"
      PORT: "3000"

      # Security
      CORS_ORIGINS: "https://yourdomain.com,https://api.yourdomain.com"
    restart: unless-stopped
    networks:
      - rabt-network
    volumes:
      - rabt-uploads:/app/public/uploads
      - rabt-data:/app/data
      - rabt-cache:/app/.next/cache

networks:
  rabt-network:
    driver: bridge

volumes:
  rabt-uploads:
  rabt-data:
  rabt-cache:
```

2. Create `Dockerfile`:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
LABEL org.opencontainers.image.source="https://github.com/kraito/rabt"
LABEL org.opencontainers.image.description="Rabt Organization Contact Directory Developed by Kraito"
LABEL org.opencontainers.image.licenses="Commercial License"

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
COPY .env .env.local* ./

RUN npm install

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1
ENV SKIP_SMTP_VERIFY=true

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.env* ./
COPY . .

RUN node --max_old_space_size=4096 node_modules/.bin/next build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.env* ./

RUN mkdir -p .next/cache
RUN chown -R nextjs:nodejs .next
RUN chmod -R 755 .next

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Deployment Steps

1. Start the containers:

   ```bash
   docker-compose up -d
   ```

2. Verify deployment:
   ```bash
   docker-compose ps
   docker-compose logs
   ```

### Method 3: PM2 Deployment

#### Installation & Setup

1. Install PM2:

   ```bash
   npm install -g pm2
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build application:
   ```bash
   npm run build
   ```

#### Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "rabt",
      script: "./node_modules/next/dist/bin/next",
      args: "start",
      //instances: 'max',
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
      },
    },
  ],
};
```

#### Deployment Steps

1. Start application:

   ```bash
   pm2 start ecosystem.config.js --env production
   ```

2. Setup auto-restart:

   ```bash
   pm2 startup
   pm2 save
   ```

3. Monitor application:
   ```bash
   pm2 monit
   pm2 logs rabt
   ```

## Troubleshooting Guide

### Database Issues

1. Connection failures:
   ```bash
   # Test MongoDB connection
   mongosh "your-connection-string"
   ```
   - Check IP whitelist
   - Verify credentials
   - Test network connectivity

### Build Failures

1. Clear build cache:

   ```bash
   rm -rf .next
   npm run build
   ```

2. Check dependency conflicts:
   ```bash
   npm ls
   ```

### Runtime Errors

1. Check logs based on deployment method:

   ```bash
   # Vercel
   vercel logs

   # Docker
   docker logs rabt

   # PM2
   pm2 logs rabt
   ```

2. Common fixes:
   - Restart application
   - Verify environment variables
   - Check system resources
   - Monitor memory usage

### Performance Issues

1. Monitor metrics:

   ```bash
   # PM2
   pm2 monit

   # Docker
   docker stats rabt
   ```

2. Optimization steps:
   - Scale instances
   - Adjust memory limits
   - Enable caching
   - Optimize database queries

## Security Checklist

- [ ] Environment variables properly set
- [ ] CORS origins configured
- [ ] OAuth credentials secured
- [ ] Database access restricted
- [ ] SMTP credentials protected
- [ ] SSL/TLS enabled
- [ ] Regular security updates
- [ ] Proper error handling

## Super Admin Setup

### Method 1: Using MongoDB Compass

1. Open MongoDB Compass and connect to your database
2. Navigate to the `users` collection
3. Find the user you want to make Super Admin
4. Click Edit Document
5. Change the `role` field value from `"User"` to `"Super Admin"`
6. Click Save

Example document modification:

```json
{
  "_id": ObjectId("..."),
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "Super Admin",  // Change this field
  "isVerified": true,
  // ... other fields
}
```

### Method 2: Development Server with OAuth

1. Stop the production server if running
2. Modify the OAuth sign-in code in `route.ts` temporarily:

```typescript
const newUser = await User.createWithoutValidation({
  name: user.name || profile?.name || "User",
  email: user.email,
  role: "Super Admin", // Change this from "User" to "Super Admin"
  isVerified: true,
  oauth: {
    [account.provider]: {
      providerAccountId: account.providerAccountId,
      accessToken: account.access_token,
      refreshToken: account.refresh_token,
    },
  },
});
```

3. Start the development server:

```bash
npm run dev
```

4. Sign in using Google or Facebook OAuth
5. Verify in MongoDB that the user was created with Super Admin role
6. Revert the code change back to `"User"` role
7. Restart the production server

### Method 3: Using MongoDB Shell

1. Connect to your MongoDB instance:

```bash
mongosh "your-connection-string"
```

2. Run the following command:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "Super Admin" } }
);
```

### Security Notes

- Create only one Super Admin account initially
- Document the Super Admin email for organizational records
- Change the role back to "User" in the code after creating the Super Admin
- Consider implementing an audit log for role changes
- Regularly review user roles and permissions
