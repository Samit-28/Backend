import {
  IsBoolean,
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { LaptopCondition } from '@prisma/client';
import { Type } from 'class-transformer'; // Todo

import { toBoolean } from 'src/common/decorators/to.boolean.decorator';

export class laptopDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  // @IsString()
  // imageUrl: string

  @IsString()
  specifications: string;

  @IsEnum(LaptopCondition)
  condition: LaptopCondition;

  // @Type(() => Boolean)
  @toBoolean()
  @IsOptional()
  @IsBoolean()
  isAssigned: boolean;

  // @Type(() => Boolean)
  @toBoolean()
  @IsOptional()
  @IsBoolean()
  isForSale: boolean;

  @Type(() => Number)
  @IsNumber()
  usageMonths: number;

  @Type(() => Number)
  @IsNumber()
  price: number;
}
