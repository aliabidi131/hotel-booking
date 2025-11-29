// src/app/models/user.model.ts

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  displayName: string;
}
