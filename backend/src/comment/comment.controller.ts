import { Controller, Get, Post, Body, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@Controller('articles/:articleSlug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createComment(
    @Param('articleSlug') articleSlug: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentService.createComment(articleSlug, createCommentDto);
    return new ApiResponse(comment, undefined, undefined, 'Comment created successfully');
  }

  @Get()
  async getComments(@Param('articleSlug') articleSlug: string) {
    const comments = await this.commentService.getCommentsByArticle(articleSlug);
    return new ApiResponse(comments, { count: comments.length }, undefined, 'Comments retrieved successfully');
  }
}
