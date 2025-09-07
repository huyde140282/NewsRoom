import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpStatus,
  HttpCode,
  Version,
  Req,
  UseInterceptors
} from '@nestjs/common';
import { Request } from 'express';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryDto } from './dto/article-query.dto';
import { ApiResponse, PaginatedResponse } from '../common/dto/api-response.dto';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@Controller('articles')
@UseInterceptors(ResponseInterceptor)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @Version('1')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: ArticleQueryDto, @Req() req: Request) {
    const result = await this.articleService.findAll(query);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
    
    return new PaginatedResponse(
      result.articles,
      result.total,
      result.page,
      result.limit,
      baseUrl,
      'Articles retrieved successfully'
    );
  }

  @Get('featured')
  @HttpCode(HttpStatus.OK)
  async findFeatured(@Query('limit') limit?: string) {
    const numericLimit = limit ? parseInt(limit, 10) : undefined;
    const articles = await this.articleService.findFeatured(numericLimit);
    
    return new ApiResponse(
      articles,
      {
        total: articles.length,
        count: articles.length,
      },
      undefined,
      'Featured articles retrieved successfully'
    );
  }

  @Get('trending')
  @HttpCode(HttpStatus.OK)
  async findTrending(@Query('limit') limit?: string) {
    const numericLimit = limit ? parseInt(limit, 10) : undefined;
    const articles = await this.articleService.findTrending(numericLimit);
    
    return new ApiResponse(
      articles,
      {
        total: articles.length,
        count: articles.length,
      },
      undefined,
      'Trending articles retrieved successfully'
    );
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('slug') slug: string) {
    const article = await this.articleService.findBySlug(slug);
    
    return new ApiResponse(
      article,
      undefined,
      undefined,
      'Article retrieved successfully'
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArticleDto: CreateArticleDto) {
    const article = await this.articleService.create(createArticleDto);
    
    return new ApiResponse(
      article,
      undefined,
      undefined,
      'Article created successfully'
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    const article = await this.articleService.update(id, updateArticleDto);
    
    return new ApiResponse(
      article,
      undefined,
      undefined,
      'Article updated successfully'
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.articleService.remove(id);
    
    return new ApiResponse(
      null,
      undefined,
      undefined,
      'Article deleted successfully'
    );
  }
}
