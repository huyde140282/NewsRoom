import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ArticleStatus } from '../../database/entities/article.entity';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsString()
  categoryId: string;

  @IsString()
  authorId: string;

  @IsOptional()
  @IsString({ each: true })
  tagIds?: string[];

  @IsOptional()
  @IsDateString()
  publishedAt?: Date;
}
