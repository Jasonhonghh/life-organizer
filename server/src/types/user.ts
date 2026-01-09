export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface UsersDatabase {
  users: User[];
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
