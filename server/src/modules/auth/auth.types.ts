export interface AuthUserRecord {
  id: string;
  provider: string;
  providerUserId: string;
  name: string;
  email: string;
  avatarUrl: string;
  accessToken: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}
