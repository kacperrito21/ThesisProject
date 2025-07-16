import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail format is not valid' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password is too short' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  firstName: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  firstName: string;
}
