import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { type DatabaseConfig } from './database.types';

@Injectable()
export class SequelizeDatabaseClient extends Sequelize {
  constructor(config: DatabaseConfig) {
    if (config.connectionString) {
      const connectionUrl = new URL(config.connectionString);

      if (!connectionUrl.password) {
        connectionUrl.password = config.password ?? '';
      }

      super(connectionUrl.toString(), {
        dialect: 'postgres',
        logging: false,
      });

      return;
    }

    super(config.database, config.user, String(config.password ?? ''), {
      dialect: 'postgres',
      host: config.host,
      port: config.port,
      logging: false,
    });
  }
}
