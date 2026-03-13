import { Inject, Injectable, Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import {
  DATABASE_SEQUELIZE,
  type DatabaseHealthChecker,
} from './database.types';

@Injectable()
export class SequelizeHealthCheckerService implements DatabaseHealthChecker {
  private readonly logger = new Logger(SequelizeHealthCheckerService.name);

  constructor(
    @Inject(DATABASE_SEQUELIZE) private readonly sequelize: Sequelize,
  ) {}

  async isHealthy(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }
}
