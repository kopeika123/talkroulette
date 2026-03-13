import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UpsertSocialAuthUserDto } from './dto/upsert-social-auth-user.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private readonly authRepository: AuthRepository) {}

  async onModuleInit(): Promise<void> {
    await this.authRepository.ensureTable();
  }

  upsertSocialUser(payload: UpsertSocialAuthUserDto) {
    return this.authRepository.upsertSocialUser({
      provider: payload.provider.trim().toLowerCase(),
      providerUserId: payload.providerUserId.trim(),
      name: payload.name.trim(),
      email: payload.email?.trim() ?? '',
      avatarUrl: payload.avatarUrl?.trim() ?? '',
      accessToken: payload.accessToken?.trim() ?? '',
    });
  }
}
