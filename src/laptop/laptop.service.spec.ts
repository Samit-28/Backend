import { Test, TestingModule } from '@nestjs/testing';
import { LaptopService } from './laptop.service';

describe('LaptopService', () => {
  let service: LaptopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaptopService],
    }).compile();

    service = module.get<LaptopService>(LaptopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
