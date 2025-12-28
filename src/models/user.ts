import { AuthProvider, UserRole } from "../enums";

export interface User {
  _id: string;
  role: UserRole;
  provider: AuthProvider;
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
