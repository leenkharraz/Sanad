export interface SanadUser {
  id: string;
  name: string;
  email: string;
  isDemo: boolean;
}

export interface AuthSession {
  user: SanadUser;
  createdAt: string;
}
