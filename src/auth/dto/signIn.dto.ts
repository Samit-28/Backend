import { IsString, MinLength } from 'class-validator';

export class signInDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
