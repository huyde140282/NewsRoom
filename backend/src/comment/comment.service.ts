import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../database/entities/comment.entity';
import { Article, ArticleStatus } from '../database/entities/article.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async createComment(articleSlug: string, createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    // Find article by slug
    const article = await this.articleRepository.findOne({
      where: { slug: articleSlug, status: ArticleStatus.PUBLISHED }
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Basic spam prevention - check for duplicate comments
    const existingComment = await this.commentRepository.findOne({
      where: {
        articleId: article.id,
        authorEmail: createCommentDto.authorEmail,
        content: createCommentDto.content,
      }
    });

    if (existingComment) {
      throw new BadRequestException('Duplicate comment detected');
    }

    // Create comment
    const comment = this.commentRepository.create({
      ...createCommentDto,
      articleId: article.id,
      isApproved: true, // Auto-approve for now, can add moderation later
    });

    const savedComment = await this.commentRepository.save(comment);
    
    return new CommentResponseDto(savedComment);
  }

  async getCommentsByArticle(articleSlug: string): Promise<CommentResponseDto[]> {
    const article = await this.articleRepository.findOne({
      where: { slug: articleSlug }
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const comments = await this.commentRepository.find({
      where: { 
        articleId: article.id,
        isApproved: true 
      },
      order: { createdAt: 'DESC' }
    });

    return comments.map(comment => new CommentResponseDto(comment));
  }

  async getCommentsCount(articleId: string): Promise<number> {
    return this.commentRepository.count({
      where: { 
        articleId,
        isApproved: true 
      }
    });
  }
}
