import { Test, TestingModule } from '@nestjs/testing';
import { LaptopController } from './laptop.controller';

describe('LaptopController', () => {
  let controller: LaptopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaptopController],
    }).compile();

    controller = module.get<LaptopController>(LaptopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
