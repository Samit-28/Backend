import { PartialType } from '@nestjs/mapped-types';
import { createUserDto } from './create_user.dto';

export class UpdatedUserDto extends PartialType(createUserDto) {}
