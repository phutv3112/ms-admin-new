export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  address?: Address;
  isLocked: boolean;
}

export interface CreateUserRequest {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  userCount: number;
}
