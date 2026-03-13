import { Module } from '@nestjs/common';
import { LIVEKIT_CONFIG_PROVIDER } from './livekit.constants';
import { LivekitConfigService } from './livekit-config.service';
import { LivekitController } from './livekit.controller';
import { LivekitTokenService } from './livekit-token.service';

@Module({
  controllers: [LivekitController],
  providers: [
    LivekitConfigService,
    LivekitTokenService,
    {
      provide: LIVEKIT_CONFIG_PROVIDER,
      useExisting: LivekitConfigService,
    },
  ],
})
export class LivekitModule {}
