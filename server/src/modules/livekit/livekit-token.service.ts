import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AccessToken } from 'livekit-server-sdk';
import { LIVEKIT_CONFIG_PROVIDER } from './livekit.constants';
import type {
  CreateLivekitTokenInput,
  LivekitConfig,
  LivekitConfigProvider,
} from './livekit.types';

const DEFAULT_ROOM_NAME = 'talkroulette-lobby';

@Injectable()
export class LivekitTokenService {
  constructor(
    @Inject(LIVEKIT_CONFIG_PROVIDER)
    private readonly configProvider: LivekitConfigProvider,
  ) {}

  async createToken(input: CreateLivekitTokenInput) {
    const config = this.getConfigOrThrow();
    const identity = input.identity?.trim() || `user-${randomUUID()}`;
    const name = input.name?.trim() || identity;
    const roomName = input.roomName?.trim() || DEFAULT_ROOM_NAME;

    const token = new AccessToken(config.apiKey, config.apiSecret, {
      identity,
      name,
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    return {
      token: await token.toJwt(),
      roomName,
      serverUrl: config.serverUrl,
      identity,
      name,
    };
  }

  private getConfigOrThrow(): LivekitConfig {
    const config = this.configProvider.getConfig();

    if (!config) {
      throw new BadRequestException('LiveKit env vars are not configured');
    }

    return config;
  }
}
