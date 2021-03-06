import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Must be a string' })
  @MinLength(5, { message: 'Must include atleast 5 chars' })
  @MaxLength(200, { message: 'Must include no more than 200 chars' })
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'Must be an url' })
  image?: string;

  @IsOptional()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phone?: string;

  @IsString({ message: 'Must be a string' })
  @MinLength(8, { message: 'Must include atleast 6 chars' })
  password: string;

  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  emailToken: string;
}
