import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { SequelizeDatabaseClient } from './sequelize-database-client';

@Injectable()
export class DatabaseCleanupService implements OnApplicationShutdown {
  constructor(private readonly databaseClient: SequelizeDatabaseClient) {}

  async onApplicationShutdown(): Promise<void> {
    await this.databaseClient.close();
  }
}
