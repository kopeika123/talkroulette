import { Injectable } from '@nestjs/common';
import { type DatabaseConfig } from './database.types';

@Injectable()
export class DatabaseConfigService {
  getConfig(): DatabaseConfig {
    const connectionString = process.env.DATABASE_URL || undefined;

    return {
      host: this.getValue('DB_HOST', '127.0.0.1'),
      port: this.getNumberValue('DB_PORT', 5432),
      database: this.getValue('DB_NAME', 'videochat'),
      user: this.getValue('DB_USER', 'postgres'),
      password: this.getValue('DB_PASSWORD', ''),
      connectionString,
    };
  }

  private getValue(key: string, fallback: string): string {
    const value = process.env[key];

    return value || fallback;
  }

  private getNumberValue(key: string, fallback: number): number {
    const value = process.env[key];

    if (!value) {
      return fallback;
    }

    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
      throw new Error(`Invalid numeric environment variable: ${key}`);
    }

    return parsedValue;
  }
}
