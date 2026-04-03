export interface User {
  _id?: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birth_date: Date;
  admin: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  loginData?: User; 
}