export class UpsertSocialAuthUserDto {
  provider!: string;
  providerUserId!: string;
  name!: string;
  email?: string;
  avatarUrl?: string;
  accessToken?: string;
}
