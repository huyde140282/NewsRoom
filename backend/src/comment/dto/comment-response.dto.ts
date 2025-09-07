export class CommentResponseDto {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
  avatarUrl: string;
  website?: string;

  constructor(comment: any) {
    this.id = comment.id;
    this.authorName = comment.authorName;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.avatarUrl = comment.avatarUrl;
    this.website = comment.website;
  }
}
