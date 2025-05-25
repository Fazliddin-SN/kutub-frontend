// decoded token interface (type)
export interface DecodedToken {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin" | "owner";
  botLink: string;
  exp: number;
}
