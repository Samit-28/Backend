import { IsNumber } from 'class-validator';

export class putLaptopForsaleDto {
  @IsNumber()
  laptopId: number;

  @IsNumber()
  salePrice: number;

  @IsNumber()
  listedById: number;
}
