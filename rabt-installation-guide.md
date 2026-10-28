# Installation Guide - Rabt - CRM, Inventory, Billing & File Management System

> **Rabt v3.0.0:** Fully unified Supabase architecture (PostgreSQL, Supabase Auth, Supabase Storage).

---

## Initial Setup

### 1. System Requirements

- **Node.js:** v20.x or later (or **Bun** v1.4.x or later)
- **Package Manager:** `bun`, `npm`, or `pnpm`
- **Database:** Supabase project (Free or Pro tier at [supabase.com](https://supabase.com)) or Supabase CLI for local development

```bash
# Verify your runtime version
node --version  # Must be v20 or later
# or
bun --version   # Must be v1.4 or later
```

---

### 2. Supabase Setup (Postgres, Auth & Storage)

1. Create a new project at [supabase.com](https://supabase.com) (or start a local instance via `bun run db:start` / `npx supabase start`).
2. Run database migrations to set up the complete schema, storage buckets (`branding`, `files`, `invoices`, `pdf-jobs`), and Row-Level Security policies:
   ```bash
   bun run db:reset
   # or
   npx supabase db reset
   ```
3. Copy API credentials from your Supabase Dashboard (**Project Settings → API**):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (if generated)
   - `SUPABASE_SERVICE_ROLE_KEY`

---

### 3. Email Configuration (SMTP)

Configured for invoice emailing, payment reminders, and administrative alerts (user sign-in/verification emails are handled directly by Supabase Auth).

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM="Your Brand Name <noreply@yourdomain.com>"
SMTP_SECURE=false  # false for TLS (port 587), true for SSL (port 465)
```

**Gmail Quick Start:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-google-app-password  # Generate via Google Account → Security → 2-Step Verification → App Passwords
SMTP_FROM="Rabt <your-gmail@gmail.com>"
SMTP_SECURE=false
```

---

### 4. OAuth Configuration (Optional)

Configure Google or Facebook OAuth providers in your Supabase Dashboard under **Authentication → Providers**:
- Add your Redirect URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
- In your application, authentication redirects through `/api/auth/callback`.

---

### 5. Environment Variables Reference

Create a `.env.local` file by copying `.env.example`:

```bash
cp .env.example .env.local
```

| Variable | Description | Example / Default |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client anon key | `ey...` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Optional Supabase publishable key | `sb_publishable_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role key (private) | `ey...` |
| `NEXT_PUBLIC_APP_URL` | Application root canonical URL | `https://yourdomain.com` |
| `NODE_ENV` | Environment mode | `production` / `development` |
| `DB_ADMIN_EMAIL` | Administrative alert email recipient | `admin@example.com` |
| `SMTP_HOST` | Outbound SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (587 TLS or 465 SSL) | `587` |
| `SMTP_USER` | SMTP username | `user@example.com` |
| `SMTP_PASSWORD` | SMTP password / app password | `secret-password` |
| `SMTP_FROM` | Outbound sender name and address | `"Rabt <noreply@domain.com>"` |
| `SMTP_SECURE` | Use SSL direct socket connection | `false` |
| `CORS_ORIGINS` | Allowed origins for cross-origin requests | `https://yourdomain.com` |
| `CRON_SECRET` | Secret token to authenticate `/api/cron` | `your-random-cron-secret` |
| `LOG_RETENTION_DAYS` | Daily cron retention window for audit logs | `90` |
| `BROWSER_WS_ENDPOINT` | Optional Browserless.io / headless browser URL | `wss://chrome.browserless.io?token=...` |
| `PUPPETEER_EXECUTABLE_PATH` | Path to host Chromium executable (Docker/VPS) | `/usr/bin/chromium-browser` |

---

## Quick Start (Development)

```bash
# 1. Install dependencies
bun install
# or: npm install

# 2. Seed demo dataset (contacts, leads, products, sample invoices)
bun run seed:demo

# 3. Start development server with Turbopack
bun run dev
# or: npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open the application.

---

## Deployment Methods

### Method 1: Vercel (Recommended for Serverless)

1. Push your repository to GitHub / GitLab.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. In **Project Settings → Environment Variables**, populate all variables from `.env.example`.
4. Deploy:
   ```bash
   vercel --prod
   ```
> **Note on Cron:** Vercel automatically detects `vercel.json` and schedules `GET /api/cron` daily at `06:00 UTC`. Set the `CRON_SECRET` variable in Vercel to authorize the scheduled job.

---

### Method 2: Docker & Docker Compose

Rabt includes a production-ready multi-stage [Dockerfile](Dockerfile) with Bun and standalone Node.js runner with preconfigured Chromium for PDF rendering.

**docker-compose.yml:**

```yaml
services:
  app:
    image: ghcr.io/kraito/rabt-supabase:latest
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:-https://your-project.supabase.co}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:-your-anon-key}
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:-}
        NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_SUPABASE_URL: "https://your-project.supabase.co"
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key"
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ""
      SUPABASE_SERVICE_ROLE_KEY: "your-service-role-key"
      NEXT_PUBLIC_APP_URL: "https://yourdomain.com"
      DB_ADMIN_EMAIL: "admin@example.com"
      SMTP_HOST: "smtp.example.com"
      SMTP_PORT: "587"
      SMTP_USER: "your-smtp-user"
      SMTP_PASSWORD: "your-smtp-password"
      SMTP_FROM: "Rabt <noreply@yourdomain.com>"
      SMTP_SECURE: "false"
      CRON_SECRET: "your-cron-secret"
      LOG_RETENTION_DAYS: "90"
      CORS_ORIGINS: "https://yourdomain.com"
      NODE_ENV: "production"
    restart: unless-stopped
```

Build and launch container:

```bash
docker compose up -d --build
docker compose logs -f app
```

---

### Method 3: Linux VPS with PM2

Rabt supports standalone execution via PM2 using the included `ecosystem.config.js`:

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Install dependencies and build standalone bundle
bun install
bun run build

# 3. Start PM2 cluster process
pm2 start ecosystem.config.js --env production

# 4. Save PM2 list and configure system startup
pm2 save
pm2 startup

# 5. Monitor logs
pm2 logs rabt
```

---

## Post-Deployment Configuration

### Initial Super Admin Setup

For zero-trust security, all newly registered accounts default to the `User` role. To establish your initial `Super Admin` account:

1. Register an account through the application sign-up page (`/auth` or `/`).
2. Open your **Supabase Dashboard → SQL Editor** (or run via `supabase` CLI):

```sql
UPDATE public.profiles
SET role = 'Super Admin', is_verified = true
WHERE email = 'your-admin-email@example.com';
```

> **Note on `DB_ADMIN_EMAIL`:** The `DB_ADMIN_EMAIL` environment variable configures the administrative recipient for payment reminders, system alerts, and billing notifications. For security, it does not automatically elevate database privileges upon login.

---

### Organization Settings

Log in as Super Admin and visit `/admin/settings` to configure:

1. **Organization Info:** Company name, legal name, address, email, phone, website, tax registration info.
2. **Branding:** Site title, favicon, and Light/Dark theme logos (rendered across the app header and PDF invoices).
3. **Invoice Settings:** Default currency (USD, EUR, GBP, BDT, etc.), invoice prefix (e.g., `INV-`), payment terms in days, payment options text, and default notes.
4. **Reminder Settings:** Automated due reminder threshold (days before due date), reminder intervals, and timezone.
5. **Lead Settings:** Custom sales pipeline stages and priority levels.
6. **Public Contact Page:** Admin contact details, social links, and department heads displayed on `/contact`.

---

## Feature Configuration

### Consolidated Daily Cron (`/api/cron`)

Rabt includes a unified background maintenance route at `/api/cron` that performs all daily operations in a single run:
1. **Invoice Reminders & Overdue Transitions:** Identifies pending invoices, marks overdue records, and emails clients reminder notices.
2. **Supabase Inactivity Keep-Alive:** Pings the database to prevent free-tier project auto-pausing.
3. **Disk & Audit Log Cleanup:** Prunes audit log entries older than `LOG_RETENTION_DAYS` (default: 90 days) and deletes stale temporary PDF export jobs.

**Triggering Cron Manually or via External Scheduler:**

```bash
# Using Bearer token authorization:
curl -X GET https://yourdomain.com/api/cron \
  -H "Authorization: Bearer $CRON_SECRET"

# Or via X-Cron-Token header:
curl -X POST https://yourdomain.com/api/cron \
  -H "X-Cron-Token: $CRON_SECRET"
```

---

### Supabase Storage Buckets

Storage buckets are initialized automatically by migrations:
- `branding`: Public read access for company logos and favicons.
- `files`: Authenticated private cloud file library.
- `invoices`: Generated PDF invoice archives.
- `pdf-jobs`: Temporary processing bucket for PDF manipulation jobs.

---

### PDF Tools Suite

Available at `/utilities/pdf-tools`:
- **Merge PDFs:** Drag-and-drop combine multiple PDF documents.
- **Split PDFs:** Page-range extraction and multi-part splitting.
- **Rearrange & Rotate:** Reorder, rotate 90°/180°/270°, duplicate, or delete individual pages.
- **Document Conversion:** Convert documents and images directly to PDF using Puppeteer Chromium or `sharp`.

---

## Troubleshooting & Maintenance

### Database Connection Verification

```bash
npx supabase status
```
- Verify that `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct.
- Verify migrations were applied via `bun run db:reset`.

### Clean Rebuild

```bash
rm -rf .next node_modules
bun install
bun run build
```

### Common Issues

- **Authentication Errors:** Check Supabase Project Settings → Auth → URL Configuration and confirm Site URL and Redirect URLs match your domain.
- **Email Delivery Fails:** Test SMTP credentials using TLS (`SMTP_PORT=587`, `SMTP_SECURE=false`) or SSL (`SMTP_PORT=465`, `SMTP_SECURE=true`). For Gmail, make sure to use an App Password.
- **PDF Generation Timeout:** On low-memory environments (<2GB RAM), ensure Docker/VPS has swap memory enabled, or configure `BROWSER_WS_ENDPOINT` to offload rendering to Browserless.io.
- **File Upload Errors:** Confirm storage bucket RLS policies are applied and `SUPABASE_SERVICE_ROLE_KEY` is set.

---

## Security Checklist

- [ ] Strong random `CRON_SECRET` configured in production
- [ ] Database access protected via Supabase Row-Level Security (RLS)
- [ ] Initial Super Admin account role elevated in `public.profiles`
- [ ] Outbound alerts email configured via `DB_ADMIN_EMAIL`
- [ ] CORS origins configured to production domain
- [ ] SSL/TLS certificate active on production domain
- [ ] Service role keys kept strictly on the server (`.env.local`) and never exposed in client bundles
