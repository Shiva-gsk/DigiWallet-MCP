export interface UserType {
  name: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  username: string;
  password: number | null;
  phoneNum: string | null;
  role: "USER" | "ADMIN";
  wallet_id: string | null;
}
export interface UserTypeWithWallet {
  name: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  username: string;
  password: number | null;
  phoneNum: string | null;
  role: "USER" | "ADMIN";
  wallet_id: string | null;
  user_wallet:{
    isActive: boolean;
    balance: number;
    updatedAt: Date;
  } | null;
}

export interface MoneyRequest {
  id: string;
  amount: number;
  request_date: Date;
  status: string;
  receiver_id: string;
  sender_id: string;
  desc: string | null;
  sender?: { name: string | null; email: string };
  receiver?: { name: string | null; email: string };
}

export interface Transactions {
  id: string;
  amount: number;
  status: string;
  receiver_id: string;
  sender_id: string;
  transaction_date: Date;
  desc: string | null;
  type: string;
  sender?: { username: string | null; email: string };
  receiver?: { username: string | null; email: string };
}


export interface Stats{
  userCount: number;
  transactionCount: number;
  totalMoney: number;
  walletCount: number;
}


// model Wallet {
//   id          String       @id @default(cuid())
//   balance     Float        @default(0)
//   createdAt   DateTime     @default(now())
//   updatedAt   DateTime     @updatedAt
//   isActive    Boolean      @default(true)
//   user        User?
//   deposits    Deposit[]
//   withdrawals Withdrawal[]
// }

export interface Wallet{
  id: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  activity_type: string;
  details: string;
  timestamp: Date;
}