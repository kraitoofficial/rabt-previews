# Rabt | Organization Contact Directory

Developed by Kraito

Rabt is a contact management system designed for enterprise-scale organizations. It provides a secure, efficient, user-friendly platform for managing professional contacts, organizational directories, and personal networks. The solution emphasizes role-based access control, advanced contact management features, and seamless integration capabilities.

## Core Value Proposition

- Centralized contact management with access controlling
- Role-based access control for organizational hierarchy
- Seamless contact sharing and synchronization
- Advanced search and filtering capabilities
- Multi-platform accessibility and responsive design

## Business Applications

### 1. Corporate ContactDirectory

- Employee contact management
- Department organization
- New hire onboarding

### 2. Management, Accounts, Sales & Customer Service

- Client database management
- Quick contact access
- Customer relationship management

### 3. Professional Networking

- Personal contact organization
- Business card digitization
- Network relationship mapping

## Feature Architecture

### 1. Contact Directory Management

#### Contact Information Structure

- Personal Details
  - Name and designation
  - Departmental affiliation
  - Organizational mapping
  - Multiple contact points (2× phone, WhatsApp, email)
  - Office location and address

#### Interactive Features

- Smart Action Buttons
  - Direct call integration through default dialer
  - WhatsApp messaging through redirecting to WhatsApp
  - Email client integration through default mail app
  - Contact sharing suite
    - Digital business card (vCard)
    - QR code generation
    - Clipboard integration

#### Search and Discovery

- Advanced Search Engine
  - Full-text search across all fields
  - Real-time results
  - Smart filtering system
- Multiple Filtering
  - Organization-based filtering
  - Department categorization
  - Designation hierarchy
  - Quick reset functionality

### 2. Security and Access Management

#### Authentication System

- Multi-channel Authentication
  - Email with secure passcode
  - Google OAuth integration
  - Facebook OAuth integration

#### Role-based Access Control (RBAC)

- Hierarchical User Roles
  - User (Base access)
  - Staff (Extended access)
  - Admin (Management access)
  - Super Admin (Complete control)
- Permission Matrix

| Feature            | User | Staff | Admin | Super Admin |
| ------------------ | :--: | :---: | :---: | :---------: |
| Contact Directory  |  -   |   ✓   |   ✓   |      ✓      |
| Profile Management |  ✓   |   ✓   |   ✓   |      ✓      |
| Contact Management |  -   |   -   |   ✓   |      ✓      |
| User Management    |  -   |   -   |   ✓   |      ✓      |
| System Logs        |  -   |   -   |   -   |      ✓      |

### 3. Advanced Features

#### Contact Operations

- Bulk Management
  - Mass import capability
  - Batch export functionality
  - Multi-select delete operations
- Data Tracking
  - Contact history logging
  - Change tracking
  - Audit trails

#### Organizational Structure

- Hierarchy Management
  - Group structure definition
  - Department mapping
  - Relationship visualization

#### Data Management

- Import/Export Suite
  - Excel compatibility
  - vCard standard support
  - Backup system
- Notification System
  - Action-based alerts
  - Email notifications
  - Role change communications

### 4. User Experience

- Responsive Design
  - Mobile-first approach
  - Cross-device compatibility
- Accessibility
  - Dark/Light mode support
  - Screen reader compatibility

## Technical Implementation

### Technology Stack

- Front-end & Back-end:
  - Next.js 15 (App Router)
  - React 19
  - TypeScript 5
- Styling:
  - Tailwind CSS
  - Shadcn/ui
- Database:
  - MongoDB Atlas
- Authentication:
  - NextAuth.js 4

## System Requirements

### Development Environment

- Node.js (≥20.x.x)
- NPM (≥10.x.x)
- Git

### Production Environment

- Minimum 4GB RAM
- 20GB storage
- Modern web browser support
- SSL certification

## Getting Started

For detailed deployment instructions, please refer to our [Installation Guide](rabt-installation-guide.md).

For tutorials, previews, and additional information, visit our [GitHub Preview Repository](https://github.com/kraitoofficial/rabt-previews).

## Support

For technical support, inquiries, or customization requests, please contact us at [support@kraito.com](mailto:support@kraito.com).

## License

This software is released under a Commercial License. For licensing details, please refer to the [LICENSE.txt](LICENSE.txt) file in the root directory.

For licensing inquiries, customization requests, or support, please contact us directly.
