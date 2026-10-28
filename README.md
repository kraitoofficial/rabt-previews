# Rabt | CRM, Inventory, Billing & File Management System

Developed by Kraito

Rabt is an enterprise-ready business workspace and management system designed for modern organizations. Built on Next.js 16 and Supabase, it brings contacts directory, sales pipeline (leads), inventory tracking, multi-line invoicing, authenticated file storage, and PDF document utilities into a single, unified PostgreSQL-backed architecture with role-based access control (RBAC).

## Core Value Proposition

- **Unified PostgreSQL Architecture:** Centralized data, authentication, and file storage powered by Supabase.
- **Granular RBAC:** Complete role-based access control across User, Staff, Admin, and Super Admin tiers.
- **Full Contact Management & CRM:** Rich organizational directory with vCard, QR codes, and sales leads pipeline.
- **Billing & Invoicing Engine:** Stock-linked itemization, automated tax calculations, branded HTML/PDF invoices, SMTP delivery, and public verification.
- **Inventory Tracking:** Real-time stock deductions on invoice issuance, SKU generation, low-stock alerts, and adjustment audit logs.
- **Secure File Storage & PDF Tools:** Private Supabase Storage buckets, client-side/server-side PDF merging, splitting, page reordering, rotation, and document conversion.
- **Automated Maintenance:** Bundled daily cron for automated invoice reminders, overdue transitions, database log pruning, and Supabase keep-alive.
- **Premium User Experience:** Responsive modern UI, Dark/Light mode, fast App Router navigation with Turbopack.

## Business Applications

### 1. Corporate Contact Directory & CRM

- Centralized directory for company staff, clients, and partners
- Direct dialer, WhatsApp redirect, email triggers, vCard export, and QR codes
- Sales leads pipeline linked directly to contact records with stage tracking and deal values

### 2. Billing, Accounts & Inventory Operations

- Multi-line invoice generation with per-line taxes and custom prefixes
- Stock-deducting inventory transactions and low-stock monitoring
- Branded printable views, server-generated PDFs, and instant SMTP email dispatch
- Public invoice verification portal for external clients (`/verify/invoice`)

### 3. Document Management & Utilities

- Authenticated private cloud file library with tags and categories
- Integrated PDF tools (Merge, Split, Rotate, Delete pages, Document conversion)
- Generated PDF documents saved directly into the company file library

---

## Visual Previews

### Contact Directory & Authentication
| Directory (Light / Dark) | Sign Up / Sign In |
|:---:|:---:|
| ![Directory](Preview%20Images/Front-end/directory-light.png) | ![Sign Up](Preview%20Images/Front-end/signup-dark.png) |

### Leads Pipeline & Inventory
| Sales Leads Pipeline | Inventory Management |
|:---:|:---:|
| ![Leads Pipeline](Preview%20Images/Utilities%20&%20Inventory/Leads.png) | ![Inventory](Preview%20Images/Utilities%20&%20Inventory/Inventory.png) |

### Billing & Invoices
| Invoice View | Invoice Editor |
|:---:|:---:|
| ![Invoice View](Preview%20Images/Invoice%20&%20Settings/View%20Invoice%20Dark.png) | ![Invoice Edit](Preview%20Images/Invoice%20&%20Settings/Invoice%20Edit%20Dark.png) |

### File Storage & PDF Utilities
| Cloud File Storage | PDF Utilities Suite |
|:---:|:---:|
| ![File Storage](Preview%20Images/Utilities%20&%20Inventory/File%20Storage.png) | ![Merge PDFs](Preview%20Images/Utilities%20&%20Inventory/Merge%20PDFs.png) |

### Administrative Controls & Settings
| Admin Dashboard | User Management |
|:---:|:---:|
| ![Admin Dashboard](Preview%20Images/Back-end/dashboard-dark.png) | ![User Management](Preview%20Images/Back-end/users-dark.png) |

---

## Feature Architecture

### 1. Contact Directory & CRM Pipeline

#### Contact Directory

- Structured information: Multi-phone, WhatsApp, emails, job title, department, organization, address
- Quick actions: Direct call, WhatsApp message, email, clipboard copy
- Sharing suite: Digital business card (`.vcf` vCard) and contact QR code generation
- Instant full-text search and hierarchy filtering by organization, department, and designation

#### Leads Pipeline (CRM)

- Contact-linked sales opportunities with deal status, priority, estimated value, and expected close date
- Standard pipeline stages: Not Set, New, Contacted, Qualified, Proposal Sent, Negotiation, Won, Lost, On Hold
- Lead activity history logs and bulk lead creation/management

### 2. Invoicing & Billing Engine

- **Lifecycle:** Draft, Due, Sent, Paid, Overdue, Void
- **Inventory Integration:** Seamlessly select tracked products; stock is verified and deducted in database transactions
- **Itemization & Taxes:** Multi-line items, item descriptions, custom unit prices, per-line tax rates, and subtotal/total calculations
- **Branding & Layout:** Custom business branding (logos, address, payment terms, currency selection)
- **Delivery & Verification:** Client PDF download, SMTP email sharing with PDF attachment, and public `/verify/invoice` portal
- **Automated Reminders:** Scheduled cron job automatically sends payment reminders and marks overdue invoices

### 3. Inventory Management

- Tracked physical products and non-tracked service items
- Automated SKU assignment, cost price, selling price, and supplier tracking
- Real-time stock tracking with configurable low-stock thresholds
- Complete audit trail of manual adjustments and automated invoice stock deductions

### 4. File Storage & PDF Suite

- **Private Storage:** Files stored in dedicated Supabase Storage buckets with authenticated access
- **Organization:** Categorization (Documents, Images, Media, Other), tagging, and full-text metadata search
- **PDF Utilities:**
  - Merge multiple PDF documents
  - Split PDFs by custom page ranges, fixed page intervals, or extract single pages
  - Reorder, rotate, duplicate, or delete pages
  - Convert images and office documents to PDF

### 5. Security & Access Management

#### Authentication System

- Supabase Auth supporting Passwordless Email OTP and OAuth providers (Google, Facebook)
- Session gate via Next.js `proxy.ts` ensuring fresh claims validation and role synchronization

#### Role-Based Access Control (RBAC)

| Feature / Area | User | Staff | Admin | Super Admin |
|---|:---:|:---:|:---:|:---:|
| User Profile & Contact Page | ✓ | ✓ | ✓ | ✓ |
| Contact Directory (Read / View) | - | ✓ | ✓ | ✓ |
| Leads Pipeline | - | ✓ | ✓ | ✓ |
| Invoices & Billing | - | ✓ | ✓ | ✓ |
| Inventory Management | - | ✓ | ✓ | ✓ |
| File Storage & PDF Tools | - | ✓ | ✓ | ✓ |
| Admin Dashboard & Analytics | - | - | ✓ | ✓ |
| Contact Management (Add / Edit) | - | - | ✓ | ✓ |
| User Management | - | - | ✓ | ✓ |
| Organization & Branding Settings | - | - | View | Modify |
| System Audit Logs | - | - | View | Clear / Prune |
| Data Deletion (Contacts, Invoices, Items) | - | - | - | ✓ |

## Technical Implementation

### Technology Stack

- **Front-end & Back-end:** Next.js 16 (App Router with Turbopack), React 19, TypeScript 5
- **Database & Storage:** Supabase (PostgreSQL with Row Level Security, Supabase Auth, Supabase Storage)
- **Styling:** Tailwind CSS, Radix UI (Shadcn-inspired component system), Lucide Icons
- **Document Processing:** Puppeteer (Headless Chromium), `pdf-lib`, `sharp`
- **Email Delivery:** Nodemailer SMTP engine

## System Requirements

### Development Environment

- Node.js (≥20.x.x) or Bun (≥1.4.x)
- Supabase CLI (for local database development) or cloud Supabase project
- Git

### Production Environment

- Vercel, Docker, or Linux VPS (Ubuntu/Debian)
- Minimum 2GB RAM (4GB recommended if rendering Chromium PDFs on-server)
- Supabase project (Free or Pro tier)
- SMTP credentials for system emails

## Getting Started

For step-by-step setup and deployment instructions, refer to:
- [Installation Guide](rabt-installation-guide.md)

## Support & Licensing

- **License:** Commercial License. See [LICENSE.txt](LICENSE.txt) for terms.
- **Support:** For questions or customization inquiries, contact [support@kraito.com](mailto:support@kraito.com).
