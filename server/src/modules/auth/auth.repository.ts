import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { DATABASE_SEQUELIZE } from '../../database/database.types';
import { AuthUserModel, initAuthUserModel } from './auth-user.model';
import type { AuthUserRecord } from './auth.types';

@Injectable()
export class AuthRepository {
  private readonly authUserModel: typeof AuthUserModel;

  constructor(
    @Inject(DATABASE_SEQUELIZE) private readonly sequelize: Sequelize,
  ) {
    this.authUserModel = initAuthUserModel(sequelize);
  }

  async ensureTable(): Promise<void> {
    await this.authUserModel.sync();
  }

  async upsertSocialUser(params: {
    provider: string;
    providerUserId: string;
    name: string;
    email: string;
    avatarUrl: string;
    accessToken: string;
  }): Promise<AuthUserRecord> {
    const existingUser = await this.authUserModel.findOne({
      where: {
        provider: params.provider,
        providerUserId: params.providerUserId,
      },
    });

    if (!existingUser) {
      const createdUser = await this.authUserModel.create({
        provider: params.provider,
        providerUserId: params.providerUserId,
        name: params.name,
        email: params.email,
        avatarUrl: params.avatarUrl,
        accessToken: params.accessToken,
        lastLoginAt: new Date(),
      });

      return this.mapRow(createdUser);
    }

    existingUser.name = params.name;
    existingUser.email = params.email;
    existingUser.avatarUrl = params.avatarUrl;
    existingUser.accessToken = params.accessToken;
    existingUser.lastLoginAt = new Date();

    await existingUser.save();

    return this.mapRow(existingUser);
  }

  private mapRow(row: AuthUserModel): AuthUserRecord {
    return {
      id: String(row.id),
      provider: row.provider,
      providerUserId: row.providerUserId,
      name: row.name,
      email: row.email ?? '',
      avatarUrl: row.avatarUrl ?? '',
      accessToken: row.accessToken ?? '',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      lastLoginAt: row.lastLoginAt.toISOString(),
    };
  }
}
