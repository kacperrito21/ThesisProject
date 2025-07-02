import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Nieprawidłowy adres e-mail' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Hasło musi mieć co najmniej 6 znaków' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Imię jest wymagane' })
  firstName: string;
}
