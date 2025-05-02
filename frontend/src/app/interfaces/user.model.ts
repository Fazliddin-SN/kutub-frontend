export type Role = "user" | "admin" | "owner";

// type for user
export interface User {
  fullname: string | null;
  username: string | null;
  email: string | null;
  password: string | null;
  address: string | null;
  phone_number: string | null;
  role: string | null;
}
