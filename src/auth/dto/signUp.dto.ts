import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class signUpDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[\w.+\-]+@gmail\.com$/, {
    message: 'Email must be a Gmail address (must end with @gmail.com)',
  })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  department: string;

  @IsString()
  designation: string;

  // @IsString()
  // role: string;
}
