import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChoiceDto {
  @IsInt()
  poll_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  vote_count: number;

  voters: string[];
}

export class PollDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsInt()
  voters_count: number;

  @IsBoolean()
  anonymous: boolean;

  @IsString()
  created_at: string;

  @IsString()
  @IsOptional()
  creator: string | null;

  @IsString()
  user_id: string;

  choices: ChoiceDto[];
}
