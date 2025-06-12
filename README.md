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
2. Unzip the project folder `dbms_cs03_09.zip`
3. Navigate to the code folder:

   ```bash
   cd path/to/dbms_cs03_09
   ```

4. Install dependencies:

   ```
   npm install
   ```
5. Run the development server:

   ```
   npm run dev
   ```
6. Open your browser at `http://localhost:3000`

---

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
* **Email**: Resend used to notify admin on each transaction
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


