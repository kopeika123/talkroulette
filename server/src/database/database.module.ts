import { Module } from '@nestjs/common';
import { DatabaseCleanupService } from './database-cleanup.service';
import { DatabaseConfigService } from './database-config.service';
import {
  DATABASE_CONFIG,
  DATABASE_HEALTH_CHECKER,
  DATABASE_SEQUELIZE,
  type DatabaseConfig,
} from './database.types';
import { SequelizeDatabaseClient } from './sequelize-database-client';
import { SequelizeHealthCheckerService } from './sequelize-health-checker.service';

@Module({
  providers: [
    DatabaseConfigService,
    {
      provide: DATABASE_CONFIG,
      inject: [DatabaseConfigService],
      useFactory: (databaseConfigService: DatabaseConfigService) =>
        databaseConfigService.getConfig(),
    },
    {
      provide: SequelizeDatabaseClient,
      inject: [DATABASE_CONFIG],
      useFactory: (databaseConfig: DatabaseConfig) =>
        new SequelizeDatabaseClient(databaseConfig),
    },
    { provide: DATABASE_SEQUELIZE, useExisting: SequelizeDatabaseClient },
    SequelizeHealthCheckerService,
    {
      provide: DATABASE_HEALTH_CHECKER,
      useExisting: SequelizeHealthCheckerService,
    },
    DatabaseCleanupService,
  ],
  exports: [DATABASE_SEQUELIZE, DATABASE_HEALTH_CHECKER],
})
export class DatabaseModule {}
