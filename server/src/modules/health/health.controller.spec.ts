import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import {
  DATABASE_HEALTH_CHECKER,
  type DatabaseHealthChecker,
} from '../../database/database.types';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const databaseHealthChecker: DatabaseHealthChecker = {
      isHealthy: jest.fn().mockResolvedValue(true),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: DATABASE_HEALTH_CHECKER,
          useValue: databaseHealthChecker,
        },
      ],
    }).compile();

    healthController = moduleRef.get<HealthController>(HealthController);
  });

  it('returns server and database status', async () => {
    await expect(healthController.getHealth()).resolves.toEqual({
      message: 'Server is running',
      database: 'up',
    });
  });
});
