enum UserRole {
  Admin = "admin",
  User = "user",
  Agent = "agent",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  is_active?: boolean;
  role?: UserRole;
}
