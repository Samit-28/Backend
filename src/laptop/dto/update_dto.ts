// Todo ...

import { PartialType } from '@nestjs/mapped-types';
import { laptopDto } from './laptop_dto';

export class updatedLaptop extends PartialType(laptopDto) {}
