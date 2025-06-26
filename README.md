## Live at https://digiwallet.shivagulapala.me/

# 💳 Digital Wallet Management System

A secure and responsive web-based platform to manage digital transactions including sending/receiving money, viewing transaction history, wallet management, and more.

## 📌 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Usage](#usage)
  - [Send Money](#send-money)
  - [Money Request Management](#money-request-management)
  - [Wallet Management](#wallet-management)
  - [Transaction Management](#transaction-management)
- [Integration](#integration)
- [User Profile & Settings](#user-profile--settings)
- [Troubleshooting](#troubleshooting)
- [Support](#support)
- [Authors](#authors)

---


## 🧾 Introduction

The **Digital Wallet Management System (DWMS)** is a modern web application that enables users to perform secure digital transactions with a user-friendly interface. Designed for personal, business, and institutional use, it provides real-time tracking, authentication, and fund management tools.

---

## 🌟 Features

- 🔐 **Secure Authentication** via Clerk (email/password or OAuth with Google/GitHub)
- 💸 **Send/Receive Money** with PIN verification
- 📊 **Transaction History & Analytics**
- 🧾 **Money Request Management** (send, accept, reject requests)
- 👤 **User Profile & Settings** (password change, linked accounts, delete account)
- 📱 **Fully Responsive** for Web & Mobile
- 🔒 **2FA Enabled** on signup for additional security

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Prisma
- **Database**: PostgreSQL (Neon)
- **Authentication**: Clerk
- **Email Services**: Resend
- **Hosting**: Vercel

---

## 🧑‍💻 Requirements

### Hardware
- PC, laptop, or mobile with internet access

### Software
- Node.js installed locally

---

## 🚀 Getting Started

### Live Demo

🔗 **[Access Website](https://digiwallet.shivagulapala.me/)**  


### Local Setup

1. Install **Node.js** from [nodejs.org](https://nodejs.org)
2. Clone the repo
    ```
    git clone https://github.com/Shiva-gsk/DigiWallet-MCP.git
    ```
3. Navigate to the code folder:

   ```bash
   cd DigiWallet-MCP/digiwallet 
   ```

4. Install dependencies:

   ```
   npm install
   ```
5. You need to add following Environment variables to `.env.local` file 
    ```
    <!-- For clerk Authentication -->
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=    
    CLERK_SECRET_KEY=
    SIGNING_SECRET=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signIn
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signUp

    <!-- For Resend Email Service -->
    RESEND_API_KEY=

    <!-- For Stripe Payments -->
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
    STRIPE_SECRET_KEY=
    NEXT_PUBLIC_DEPLOYMENT_URL=http://localhost:3000

    <!-- To connect with PostgreSQL Service -->
    DATABASE_URL=
    ```

6. Run the development server:

   ```
   npm run dev
   ```
7. Open your browser at `http://localhost:3000`

### Overall Director Structure

```
digiwallet/
    ├── app/
        ├── actions/
        ├── admin/
            ├── users/
                ├── [id]/
                    └── page.tsx
                └── page.tsx
            └── page.tsx
        ├── api/
            ├── create-payment-intent/
                └── route.ts
            ├── reset-password/
                └── route.ts
            └── webhooks/
                └── clerk/
                    └── route.ts
        ├── money-request/
            └── page.tsx
        ├── payment-success/
            └── [amount]/
                └── page.tsx
        ├── reset-password/
            └── [resetToken]/
                └── page.tsx
        ├── send-money/
            ├── loading.tsx
            └── page.tsx
        ├── signIn/
            └── [[...signIn]]/
                └── page.tsx
        ├── signUp/
            └── [[...signUp]]/
                └── page.tsx
        ├── wallet/
            ├── deposit/
                └── page.tsx
            └── page.tsx
        ├── favicon.ico
        ├── globals.css
        ├── layout.tsx
        └── page.tsx
    ├── components/
    ├── lib/
        ├── convertToSubcurrency.ts
        ├── db.ts
        └── utils.ts
    ├── models/
        ├── sqlQueries/
            ├── admin.ts
            ├── request.ts
            ├── transactions.ts
            ├── user.ts
            └── wallet.ts
        └── createTables.ts
    ├── prisma/
        └── schema.prisma
    ├── public/
    ├── utils/
    ├── .gitignore
    ├── components.json
    ├── eslint.config.mjs
    ├── middleware.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── README.md
    ├── tsconfig.json
    └── types.d.ts
mcp/
    ├── app.py
    ├── data.json
    ├── requirements.txt
README.md
User Manual.docx
```
## 🧭 Dashboard Overview

### Home Page

* Redirects unauthenticated users to login
* Supports OAuth (Google, GitHub)
* Access to key features: Send Money, Requests, Wallet
* View recent transactions

### Admin Page

* Metrics: Total Users, Total Volume, Transactions
* Analytics: Transaction charts (monthly trends, type-wise pie chart)

---

## 💸 Send Money

1. Search for a recipient (by name/email)
2. Click **Send Money**
3. Enter amount and PIN
4. Balance check is done:

   * ✅ Sufficient balance → success
   * ❌ Insufficient → error

---

## 🧾 Money Request Management

* **Send Request**: Specify recipient & amount
* **Received Requests**: Accept or Reject
* **Sent Requests**: Track status (pending, accepted, rejected)

---

## 👛 Wallet Management

* View balance (hidden by default → PIN required to reveal)
* Update phone number via secured form
* Request to change Wallet password (A link will be sent to the user email for resetting Password)
* NOTE: User can change password using the link, only if he's logged into DigiWallet.

---

## 📈 Transaction Management

* View recent transactions with:

  * Sender/Receiver
  * Amount
  * Timestamp
  * Debit/Credit indicator

---

## 🔗 Integration

* **Authentication**: Clerk (OAuth, Email, MFA)
* **Email**: Resend used to notify Users on each transaction
* **Database**: Neon (PostgreSQL cloud storage)

---

## ⚙️ User Profile & Settings

* **Create Profile**: OAuth or email-password
* **Change Password**
* **Manage Linked Accounts**
* **Logout & Account Deletion**

---

## 🧯 Troubleshooting

### Login Issues

* Check credentials or reset password
* Verify internet connection

### Transaction Failures

* Ensure sufficient funds
* Retry in case of network delay

### Balance Not Updating

* Refresh or check history

### Site Not Loading

* Update browser, clear cache, check connection

