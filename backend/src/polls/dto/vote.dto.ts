import { IsBoolean, IsInt, IsString } from 'class-validator';

export class VoteDto {
  @IsInt()
  pollId: number;

  @IsString()
  name: string;

  @IsBoolean()
  anonymous: boolean;
}
