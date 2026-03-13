export interface DatabaseHealthChecker {
  isHealthy(): Promise<boolean>;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  connectionString?: string;
}

export const DATABASE_CONFIG = Symbol('DATABASE_CONFIG');
export const DATABASE_SEQUELIZE = Symbol('DATABASE_SEQUELIZE');
export const DATABASE_HEALTH_CHECKER = Symbol('DATABASE_HEALTH_CHECKER');
