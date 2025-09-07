# NewsRoom Backend Development Guide

## Tech Stack
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Containerization**: Docker
- **ORM**: TypeORM/Prisma
- **Authentication**: JWT
- **File Storage**:  local filesystem 

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── config/
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── jwt.config.ts
├── modules/
│   ├── auth/
│   ├── users/
│   ├── articles/
│   ├── categories/
│   ├── comments/
│   ├── newsletters/
│   └── upload/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── database/
    ├── migrations/
    └── seeds/
```

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### 2. Categories Table
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
```

### 3. Articles Table
```sql
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(255),
    author_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_featured ON articles(is_featured);
CREATE INDEX idx_articles_trending ON articles(is_trending);
CREATE INDEX idx_articles_published ON articles(published_at);
```

### 4. Comments Table
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    parent_id INTEGER REFERENCES comments(id),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
```

### 5. Tags Table
```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE article_tags (
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);
```

### 6. Newsletter Subscriptions
```sql
CREATE TABLE newsletter_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
```

## NestJS Modules Implementation

### 1. Articles Module

```typescript
// articles/entities/article.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Tag } from '../tags/entities/tag.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  excerpt: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  featuredImage: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isTrending: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.articles)
  author: User;

  @ManyToOne(() => Category, category => category.articles)
  category: Category;

  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

  @ManyToMany(() => Tag)
  @JoinTable({ name: 'article_tags' })
  tags: Tag[];
}
```

```typescript
// articles/articles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private cacheService: CacheService,
  ) {}

  async findAll(query: ArticleQueryDto) {
    const cacheKey = `articles:${JSON.stringify(query)}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .where('article.status = :status', { status: 'published' });

    if (query.category) {
      queryBuilder.andWhere('category.slug = :category', { category: query.category });
    }

    if (query.featured) {
      queryBuilder.andWhere('article.isFeatured = :featured', { featured: true });
    }

    if (query.trending) {
      queryBuilder.andWhere('article.isTrending = :trending', { trending: true });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(article.title ILIKE :search OR article.excerpt ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const total = await queryBuilder.getCount();
    
    const articles = await queryBuilder
      .orderBy('article.publishedAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    const result = {
      data: articles,
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.limit),
    };

    await this.cacheService.set(cacheKey, result, 300); // Cache for 5 minutes
    return result;
  }

  async findBySlug(slug: string) {
    const cacheKey = `article:${slug}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      // Increment view count without waiting
      this.incrementViewCount(cached.id);
      return cached;
    }

    const article = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.slug = :slug', { slug })
      .andWhere('article.status = :status', { status: 'published' })
      .getOne();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this.cacheService.set(cacheKey, article, 600); // Cache for 10 minutes
    await this.incrementViewCount(article.id);
    
    return article;
  }

  private async incrementViewCount(articleId: number) {
    await this.articleRepository.increment({ id: articleId }, 'viewCount', 1);
  }

  async getTrendingArticles(limit: number = 5) {
    const cacheKey = `trending:${limit}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .where('article.status = :status', { status: 'published' })
      .orderBy('article.viewCount', 'DESC')
      .addOrderBy('article.publishedAt', 'DESC')
      .take(limit)
      .getMany();

    await this.cacheService.set(cacheKey, articles, 300);
    return articles;
  }
}
```

```typescript
// articles/articles.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto, ArticleQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  findAll(@Query() query: ArticleQueryDto) {
    return this.articlesService.findAll(query);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending articles' })
  getTrending(@Query('limit') limit: number = 5) {
    return this.articlesService.getTrendingArticles(limit);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get article by slug' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Create new article' })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Update article' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete article' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
```

### 2. Comments Module

```typescript
// comments/comments.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      user: { id: userId },
    });

    return this.commentRepository.save(comment);
  }

  async findByArticle(articleId: number) {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('replies.user', 'repliesUser')
      .where('comment.articleId = :articleId', { articleId })
      .andWhere('comment.parentId IS NULL')
      .andWhere('comment.isApproved = :approved', { approved: true })
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
  }

  async approve(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.isApproved = true;
    return this.commentRepository.save(comment);
  }
}
```

## Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/newsroom
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-super-secret-jwt-key
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=newsroom
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./uploads:/var/www/uploads
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

## Redis Caching Strategy

```typescript
// cache/cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.cacheManager.store.keys(`${pattern}*`);
    if (keys.length > 0) {
      await this.cacheManager.store.mdel(...keys);
    }
  }

  // Clear article-related cache when article is updated
  async invalidateArticleCache(articleId: number, slug: string): Promise<void> {
    await Promise.all([
      this.del(`article:${slug}`),
      this.del(`article:${articleId}`),
      this.invalidatePattern('articles:'),
      this.invalidatePattern('trending:'),
    ]);
  }
}
```

## Security Best Practices

### 1. Authentication & Authorization

```typescript
// auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      username: payload.username,
      role: payload.role 
    };
  }
}
```

### 2. Input Validation

```typescript
// common/pipes/validation.pipe.ts
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map(error => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }
    
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

### 3. Rate Limiting

```typescript
// common/guards/throttle.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
```

## SQL Optimization

### 1. Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX CONCURRENTLY idx_articles_published_status ON articles(published_at, status) WHERE status = 'published';
CREATE INDEX CONCURRENTLY idx_articles_category_published ON articles(category_id, published_at) WHERE status = 'published';
CREATE INDEX CONCURRENTLY idx_articles_trending_views ON articles(is_trending, view_count) WHERE is_trending = true;
CREATE INDEX CONCURRENTLY idx_comments_article_approved ON comments(article_id, is_approved) WHERE is_approved = true;

-- Full-text search index
CREATE INDEX CONCURRENTLY idx_articles_search ON articles USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || content));
```

### 2. Query Optimization

```typescript
// articles/queries/optimized-queries.ts
export class OptimizedQueries {
  // Efficient pagination with cursor-based approach
  static async getArticlesWithCursor(
    repository: Repository<Article>,
    cursor?: number,
    limit: number = 10,
    categoryId?: number
  ) {
    const queryBuilder = repository
      .createQueryBuilder('article')
      .select([
        'article.id',
        'article.title',
        'article.slug',
        'article.excerpt',
        'article.featuredImage',
        'article.publishedAt',
        'article.viewCount',
        'author.id',
        'author.username',
        'author.fullName',
        'category.id',
        'category.name',
        'category.slug'
      ])
      .leftJoin('article.author', 'author')
      .leftJoin('article.category', 'category')
      .where('article.status = :status', { status: 'published' });

    if (cursor) {
      queryBuilder.andWhere('article.id < :cursor', { cursor });
    }

    if (categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    return queryBuilder
      .orderBy('article.id', 'DESC')
      .limit(limit + 1) // Get one extra to check if there are more
      .getMany();
  }

  // Efficient trending calculation
  static async updateTrendingArticles(repository: Repository<Article>) {
    await repository.query(`
      UPDATE articles 
      SET is_trending = CASE 
        WHEN id IN (
          SELECT id FROM (
            SELECT id,
            ROW_NUMBER() OVER (
              ORDER BY (view_count * 0.7 + EXTRACT(EPOCH FROM (NOW() - published_at)) / 3600 * 0.3) DESC
            ) as rank
            FROM articles 
            WHERE status = 'published' 
            AND published_at > NOW() - INTERVAL '7 days'
          ) ranked 
          WHERE rank <= 10
        ) THEN true 
        ELSE false 
      END
    `);
  }
}
```

## API Design Best Practices

### 1. Consistent Response Format

```typescript
// common/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  errors?: any[];
}

// common/interceptors/response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        message: 'Request successful',
        data,
      })),
    );
  }
}
```

### 2. Comprehensive DTOs

```typescript
// articles/dto/article-query.dto.ts
import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleQueryDto {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({ description: 'Category slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Show only featured articles' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ description: 'Show only trending articles' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  trending?: boolean;

  @ApiPropertyOptional({ description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'publishedAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
```

## Environment Configuration

```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'newsroom',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
});
```

## Performance Monitoring

```typescript
// common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`${method} ${url} - ${responseTime}ms`);
        
        // Log slow queries
        if (responseTime > 1000) {
          this.logger.warn(`Slow request detected: ${method} ${url} - ${responseTime}ms`);
        }
      }),
    );
  }
}
```

## Testing Strategy

```typescript
// articles/articles.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { CacheService } from '../cache/cache.service';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useClass: Repository,
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findBySlug', () => {
    it('should return cached article if exists', async () => {
      const mockArticle = { id: 1, title: 'Test', slug: 'test' };
      jest.spyOn(cacheService, 'get').mockResolvedValue(mockArticle);

      const result = await service.findBySlug('test');
      
      expect(result).toEqual(mockArticle);
      expect(cacheService.get).toHaveBeenCalledWith('article:test');
    });
  });
});
```

## Production Deployment Checklist

1. **Environment Variables**
   - [ ] All secrets in environment variables
   - [ ] Database connection strings
   - [ ] Redis configuration
   - [ ] JWT secrets

2. **Security**
   - [ ] HTTPS enabled
   - [ ] CORS configured
   - [ ] Rate limiting implemented
   - [ ] Input validation
   - [ ] SQL injection protection

3. **Performance**
   - [ ] Database indexes created
   - [ ] Redis caching implemented
   - [ ] Query optimization
   - [ ] Image optimization
   - [ ] CDN for static assets

4. **Monitoring**
   - [ ] Application logs
   - [ ] Error tracking
   - [ ] Performance monitoring
   - [ ] Database monitoring
   - [ ] Health checks

5. **Backup & Recovery**
   - [ ] Database backups
   - [ ] File backups
   - [ ] Disaster recovery plan

## Conclusion

This guide provides a comprehensive backend architecture for the NewsRoom application using modern best practices. The implementation includes:

- Scalable NestJS architecture
- Optimized PostgreSQL database design
- Redis caching strategy
- Docker containerization
- Security best practices
- Performance optimization
- Comprehensive testing

The architecture is designed to handle high traffic loads while maintaining code quality and maintainability.