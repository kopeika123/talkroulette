import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { LivekitModule } from './modules/livekit/livekit.module';

@Module({
  imports: [DatabaseModule, AuthModule, HealthModule, LivekitModule],
})
export class AppModule {}
