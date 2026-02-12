# MiLabs Backend & Super Admin Implementation

## Overview
This document outlines the backend infrastructure and Super Admin dashboard implementation for the MiLabs platform.

## 🗄️ Database Setup (PostgreSQL with Prisma)

### Installation
```bash
npm install prisma @prisma/client --save-dev
npm install @next-auth/prisma-adapter bcryptjs crypto-js
npm install --save-dev @types/crypto-js
npx prisma init
```

### Database Schema (`prisma/schema.prisma`)
The schema includes:
- **User Model**: Stores all users (patients, admins, super_admins, lab_admins)
  - `encryptedData`: Field for storing encrypted sensitive credentials
  - Role-based access control fields
  - Wallet and currency support
  
- **Account & Session Models**: NextAuth.js integration for OAuth
- **Booking Model**: Lab test bookings with user relations
- **VerificationToken Model**: Email verification support

### Environment Variables
Add to `.env.local`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/milabs?schema=public
ENCRYPTION_KEY=your-super-secret-encryption-key-change-this-in-production
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name init

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 🔐 Security Features

### Encryption System (`src/lib/encryption.ts`)
- **AES Encryption** using crypto-js
- Functions:
  - `encryptData(text)`: Encrypts sensitive data before storage
  - `decryptData(cipherText)`: Decrypts data (Super Admin only)
- **Use Case**: Storing reversible credentials for admin audit purposes

### Security Best Practices
1. ✅ Encrypted credentials storage
2. ✅ Role-based API access control
3. ✅ Security audit logging for decryption attempts
4. ✅ Super Admin-only decrypt functionality
5. ⚠️ **IMPORTANT**: Change `ENCRYPTION_KEY` in production!

## 🎯 Super Admin Features

### Dashboard Capabilities
1. **Overview Tab**
   - Total Users count
   - Total Admins count
   - Total Patients count
   - Total Revenue metrics
   
2. **Admin Management Tab**
   - View all system administrators
   - Search and filter admins
   - **Decrypt Button**: Reveals encrypted credentials
   - Edit/Delete admin accounts
   - View admin roles and creation dates

3. **Patient Management Tab**
   - View all patients
   - Check wallet balances
   - View booking history
   - Patient contact information

### Decrypt Functionality
- **Location**: Admin Management tab
- **Access**: Super Admin role only
- **Features**:
  - Click "Decrypt" button next to admin record
  - Reveals encrypted credentials in yellow highlight box
  - "Hide" button to re-encrypt display
  - Security audit log entry created on each decrypt
  - Loading state during decryption

## 📡 API Routes

### 1. Super Admin Dashboard API
**Endpoint**: `/api/super-admin/dashboard`
**Method**: GET
**Query Parameters**:
- `type=stats`: Returns dashboard statistics
- `type=admins`: Returns list of all admins
- `type=patients`: Returns paginated patient list
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

**Authentication**: Requires `super_admin` role

**Response Examples**:
```json
// type=stats
{
  "totalUsers": 1247,
  "totalAdmins": 15,
  "totalPatients": 1200,
  "totalBookings": 3456,
  "totalRevenue": 125000
}

// type=admins
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@milabs.com",
    "role": "admin",
    "phone": "+1234567890",
    "encryptedData": "U2FsdGVkX1...",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
]
```

### 2. Decrypt Credentials API
**Endpoint**: `/api/super-admin/decrypt`
**Method**: POST
**Body**:
```json
{
  "encryptedData": "U2FsdGVkX1..."
}
```

**Authentication**: Requires `super_admin` role

**Response**:
```json
{
  "success": true,
  "decryptedData": "original-password-123"
}
```

**Security Features**:
- Role verification before decryption
- Audit logging with timestamp and admin email
- Error handling for invalid encrypted data

## 🚀 Usage Instructions

### For Developers

1. **Start PostgreSQL Database**
   ```bash
   # Install PostgreSQL if not already installed
   # Windows: Download from postgresql.org
   # Mac: brew install postgresql
   # Linux: sudo apt-get install postgresql
   
   # Start PostgreSQL service
   # Windows: Services → PostgreSQL
   # Mac: brew services start postgresql
   # Linux: sudo service postgresql start
   ```

2. **Initialize Database**
   ```bash
   cd d:/milab-web/milabs-frontend
   npx prisma db push
   npx prisma generate
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Super Admin Dashboard**
   - Navigate to: `http://localhost:3000/super-admin/dashboard`
   - Ensure your user has `role: 'super_admin'` in the session

### For Super Admins

1. **Viewing Statistics**
   - Click "Overview" tab
   - View real-time platform metrics

2. **Managing Admins**
   - Click "Admin Management" tab
   - Use search bar to find specific admins
   - Click "Decrypt" to reveal encrypted credentials
   - Click "Hide" to re-encrypt the display
   - Use Edit/Delete buttons for admin management

3. **Managing Patients**
   - Click "Patient Management" tab
   - View patient details, wallet balances, and booking counts

## 📊 Data Flow

```
User Login → NextAuth Session → Role Check → Super Admin Dashboard
                                                    ↓
                                    ┌──────────────┴──────────────┐
                                    ↓                             ↓
                            Fetch Dashboard Stats        Fetch Admin/Patient Data
                                    ↓                             ↓
                            Display Overview          Display Management Tables
                                                                  ↓
                                                        Click "Decrypt" Button
                                                                  ↓
                                                    POST /api/super-admin/decrypt
                                                                  ↓
                                                        Verify Super Admin Role
                                                                  ↓
                                                        Decrypt Using AES Key
                                                                  ↓
                                                        Log Security Audit
                                                                  ↓
                                                        Return Decrypted Data
                                                                  ↓
                                                        Display in Yellow Box
```

## 🔧 Current Status

### ✅ Completed
- [x] Prisma schema design
- [x] Encryption/Decryption utilities
- [x] Super Admin dashboard UI
- [x] Dashboard API route
- [x] Decrypt API route
- [x] Role-based access control
- [x] Security audit logging
- [x] Mock data integration

### ⏳ Pending (Requires PostgreSQL Setup)
- [ ] Prisma client generation (blocked by DATABASE_URL connection)
- [ ] Database migration
- [ ] Real database queries (currently using mock data)
- [ ] User CRUD operations
- [ ] Admin invitation system

### 🎯 Next Steps

1. **Setup PostgreSQL**
   - Install and start PostgreSQL service
   - Create `milabs` database
   - Run `npx prisma db push`

2. **Replace Mock Data**
   - Update API routes to use Prisma queries
   - Example:
     ```typescript
     import { prisma } from '@/lib/prisma';
     
     const admins = await prisma.user.findMany({
       where: { role: { in: ['admin', 'lab_admin', 'marketing_admin'] } }
     });
     ```

3. **Implement User Management**
   - Create admin invitation flow
   - Add user creation/editing forms
   - Implement password hashing with bcryptjs

4. **Add Real-time Features**
   - WebSocket for live activity feed
   - Real-time dashboard updates
   - Notification system

## 🛡️ Security Considerations

### Production Checklist
- [ ] Change `ENCRYPTION_KEY` to a strong, random value
- [ ] Use environment-specific secrets
- [ ] Enable HTTPS only
- [ ] Implement rate limiting on decrypt endpoint
- [ ] Add 2FA for Super Admin accounts
- [ ] Regular security audits of decrypt logs
- [ ] Implement data retention policies
- [ ] Add IP whitelisting for admin access

### Encryption Notes
⚠️ **WARNING**: Storing reversible passwords is generally considered insecure. This implementation is designed for specific admin audit requirements only. For production:
- Consider using one-way hashing (bcrypt) for passwords
- Only encrypt truly necessary data
- Implement strict access controls
- Regular security reviews

## 📝 File Structure

```
src/
├── app/
│   ├── api/
│   │   └── super-admin/
│   │       ├── dashboard/
│   │       │   └── route.ts          # Dashboard data API
│   │       └── decrypt/
│   │           └── route.ts          # Decrypt credentials API
│   └── super-admin/
│       └── dashboard/
│           └── page.tsx              # Super Admin UI
├── lib/
│   ├── encryption.ts                 # AES encryption utilities
│   └── prisma.ts                     # Prisma client singleton
└── prisma/
    └── schema.prisma                 # Database schema

.env.local                            # Environment variables
```

## 🎨 UI Features

- **Responsive Design**: Mobile-friendly tables and layouts
- **Dark Mode Support**: Full dark theme compatibility
- **Loading States**: Spinner animations during API calls
- **Toast Notifications**: Success/error feedback using Sonner
- **Search Functionality**: Real-time admin search
- **Color-Coded Roles**: Visual role identification
- **Secure Display**: Yellow highlight for decrypted data
- **Accessibility**: ARIA labels and keyboard navigation

## 📞 Support

For issues or questions:
1. Check PostgreSQL connection
2. Verify environment variables in `.env.local`
3. Check browser console for errors
4. Review API route responses in Network tab
5. Ensure user session has `super_admin` role

---

**Last Updated**: February 10, 2026
**Version**: 1.0.0
**Status**: Development (Mock Data) → Awaiting PostgreSQL Setup
