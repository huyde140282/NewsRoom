import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../database/entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryDto } from './dto/article-query.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll(query: ArticleQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      categorySlug,
      status = 'published',
      sortBy = 'publishedAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.status = :status', { status });

    if (search) {
      queryBuilder.andWhere(
        '(article.title ILIKE :search OR article.excerpt ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    if (categorySlug) {
      queryBuilder.andWhere('category.slug = :categorySlug', { categorySlug });
    }

    const total = await queryBuilder.getCount();

    const articles = await queryBuilder
      .orderBy(`article.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string) {
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

    // Increment view count
    await this.articleRepository.increment({ id: article.id }, 'viewCount', 1);

    return article;
  }

  async findFeatured(limit: number = 1) {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .where('article.status = :status', { status: 'published' })
      .orderBy('article.publishedAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async findTrending(limit: number = 5) {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .where('article.status = :status', { status: 'published' })
      .andWhere('article.publishedAt > :weekAgo', { 
        weekAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
      })
      .orderBy('article.viewCount', 'DESC')
      .addOrderBy('article.publishedAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articleRepository.create(createArticleDto);
    return this.articleRepository.save(article);
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    Object.assign(article, updateArticleDto);
    return this.articleRepository.save(article);
  }

  async remove(id: string) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this.articleRepository.remove(article);
    return { message: 'Article deleted successfully' };
  }
}
