import { Injectable } from '@nestjs/common';
import type { LivekitConfig } from './livekit.types';

@Injectable()
export class LivekitConfigService {
  getConfig(): LivekitConfig | null {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      return null;
    }

    return {
      apiKey,
      apiSecret,
      serverUrl,
    };
  }
}
