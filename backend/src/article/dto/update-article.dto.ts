import { CreateArticleDto } from './create-article.dto';
import { IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  excerpt?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  featuredImage?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  tagIds?: string[];

  @IsOptional()
  publishedAt?: Date;
}
