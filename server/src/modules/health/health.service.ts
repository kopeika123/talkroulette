import { Inject, Injectable } from '@nestjs/common';
import {
  DATABASE_HEALTH_CHECKER,
  type DatabaseHealthChecker,
} from '../../database/database.types';

@Injectable()
export class HealthService {
  constructor(
    @Inject(DATABASE_HEALTH_CHECKER)
    private readonly databaseHealthChecker: DatabaseHealthChecker,
  ) {}

  async getStatus() {
    const isDatabaseAvailable = await this.databaseHealthChecker.isHealthy();

    return {
      message: 'Server is running',
      database: isDatabaseAvailable ? 'up' : 'down',
    };
  }
}
