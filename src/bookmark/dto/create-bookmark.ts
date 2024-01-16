import { IsOptional, IsString } from 'class-validator';

export class CreateBookmark {
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  link: string;
}
