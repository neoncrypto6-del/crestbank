export interface User {
  id: string;
  full_name: string;
  email: string;
  username: string;
  phone: string;
  date_of_birth: string;
  ssn: string;
  address: string;
  account_type: string;
  account_number: string;
  routing_number: string;
  balance: number;
  pin?: string;
  profile_picture_url?: string;
  verification_status: string;
  cashapp_tag?: string;
  bank_name?: string;
  welcome_message?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  description: string;
  recipient_details?: any;
  status: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
}