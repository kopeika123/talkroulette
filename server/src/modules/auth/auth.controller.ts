import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpsertSocialAuthUserDto } from './dto/upsert-social-auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('social-session')
  async upsertSocialSession(@Body() body: UpsertSocialAuthUserDto) {
    if (!body?.provider?.trim()) {
      throw new BadRequestException('provider is required');
    }

    if (!body?.providerUserId?.trim()) {
      throw new BadRequestException('providerUserId is required');
    }

    if (!body?.name?.trim()) {
      throw new BadRequestException('name is required');
    }

    const user = await this.authService.upsertSocialUser(body);

    return {
      session: {
        id: user.providerUserId,
        provider: user.provider,
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl,
        accessToken: user.accessToken,
        userId: user.id,
        lastLoginAt: user.lastLoginAt,
      },
    };
  }
}
