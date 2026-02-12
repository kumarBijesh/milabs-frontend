# MiLabs - Healthcare Marketplace

## Overview
MiLabs is a modern, decentralized healthcare marketplace connecting patients with verified labs for seamless test booking and report management.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4
- **Styling**: Custom Design System with Glassmorphism & Gradients
- **State Management**: Zustand
- **Backend (Mock/API)**: Next.js API Routes (Serverless Functions)
- **Database Models**: Mongoose (MongoDB) schemas included in `src/models`

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open https://milabs-frontend.vercel.app/ to view the application.

## Key Features Implemented

### Public Website
- **Home Page**: Modern hero section, categories, trending deals, and app promo.
- **Deals Page**: Browse and filter health packages.
- **Labs Page**: List of partner labs with ratings and verification status.
- **Auth**: Beautiful login/signup pages with role selection (Patient vs Lab).

### Patient Panel (`/patient`)
- **Dashboard**: Overview of health stats and recent activity.
- **Bookings**: Manage upcoming and past appointments.
- **Reports**: Access and download medical reports.
- **Profile**: Manage personal details and settings.

### Admin Panel (`/admin`)
- **Dashboard**: High-level platform stats (revenue, users, labs).
- **Management**: Placeholders for managing users, labs, and payments.

## Project Structure
- `src/app`: Next.js App Router pages and API routes.
- `src/components`: UI components organized by feature (home, deals, layout).
- `src/hooks`: Custom hooks (useAuth, useCurrency).
- `src/models`: Mongoose schemas for MongoDB.
- `src/lib`: Utilities and mock data.
- `src/store`: Global state stores.

## Next Steps
- Connect to a real MongoDB database.
- Implement real authentication using NextAuth.js.
- Build out the Lab Partner dashboard.
- Integrate a payment gateway (Stripe/Razorpay).
