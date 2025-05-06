import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const executeQueries = async () => {
  try {
    console.log("Executing SQL schema...");

    await prisma.$executeRaw`
    CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
    `;

    await prisma.$executeRaw`
    CREATE TABLE "Wallet" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "balance" DOUBLE PRECISION DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        "isActive" BOOLEAN DEFAULT true
    );
    `;

    await prisma.$executeRaw`
    CREATE TABLE "User" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" TEXT UNIQUE NOT NULL,
        "username" TEXT UNIQUE NOT NULL,
        "name" TEXT,
        "password" INTEGER,
        "phoneNum" TEXT,
        "role" "Role" DEFAULT 'USER',
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        "wallet_id" TEXT UNIQUE,
        FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
    `;

    await prisma.$executeRaw`
    CREATE TABLE "Transaction" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "receiver_id" TEXT NOT NULL,
        "sender_id" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "transaction_date" TIMESTAMP DEFAULT now(),
        "desc" TEXT,
        FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

    await prisma.$executeRaw`
    CREATE TABLE "MoneyRequest" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "status" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "request_date" TIMESTAMP DEFAULT now(),
        "desc" TEXT,
        "sender_id" TEXT NOT NULL,
        "receiver_id" TEXT NOT NULL,
        FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

    await prisma.$executeRaw`
    CREATE TABLE "Deposit" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "walletId" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "request_date" TIMESTAMP DEFAULT now(),
        "process_date" TIMESTAMP DEFAULT now(),
        "status" TEXT NOT NULL,
        FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

    await prisma.$executeRaw`
    CREATE TABLE "Withdrawal" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "walletId" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "request_date" TIMESTAMP DEFAULT now(),
        "process_date" TIMESTAMP DEFAULT now(),
        "status" TEXT NOT NULL,
        FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

    await prisma.$executeRaw`
    CREATE TABLE "ActivityLog" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL,
        "activity_type" TEXT NOT NULL,
        "details" TEXT,
        "timestamp" TIMESTAMP DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

    await prisma.$executeRaw`
    CREATE TABLE "Notification" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "is_read" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT now(),
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `;

    await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS idx_user_id ON "User" ("id");
    CREATE INDEX IF NOT EXISTS idx_wallet_id ON "Wallet" ("id");
    CREATE INDEX IF NOT EXISTS idx_transaction_id ON "Transaction" ("id");
    CREATE INDEX IF NOT EXISTS idx_money_request_id ON "MoneyRequest" ("id");
    CREATE INDEX IF NOT EXISTS idx_deposit_id ON "Deposit" ("id");
    CREATE INDEX IF NOT EXISTS idx_withdrawal_id ON "Withdrawal" ("id");
    CREATE INDEX IF NOT EXISTS idx_activity_log_id ON "ActivityLog" ("id");
    CREATE INDEX IF NOT EXISTS idx_notification_id ON "Notification" ("id");
    `;

    console.log("SQL schema executed successfully!");
  } catch (error) {
    console.error("Error executing SQL schema:", error);
  } finally {
    await prisma.$disconnect();
  }
};

executeQueries();
export default executeQueries;
