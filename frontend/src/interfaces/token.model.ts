// decoded token interface (type)
export interface DecodedToken {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'owner';
  exp: number;
}
