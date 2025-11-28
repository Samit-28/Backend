import { IsNumber, IsInt } from 'class-validator';

export class butLaptop {
  @IsNumber()
  price: number;

  @IsInt()
  laptopId: number;

  @IsInt()
  userId: number;
}
