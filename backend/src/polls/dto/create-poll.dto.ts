import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreatePollDto {
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ArrayMinSize(2)
  @ArrayMaxSize(8)
  @MaxLength(50, { each: true })
  choices: string[];

  @IsBoolean()
  anonymous: boolean;
}
