import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            user: { count: jest.fn().mockResolvedValue(0) },
            product: { count: jest.fn().mockResolvedValue(0) },
            category: { count: jest.fn().mockResolvedValue(0) },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return status ok', async () => {
      const result = await appController.getHealth();
      expect(result.status).toBe('ok');
    });
  });
});