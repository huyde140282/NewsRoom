import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Article } from './article.entity';

@Entity('comments')
@Index(['articleId'])
@Index(['isApproved'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  authorName: string;

  @Column({ length: 255 })
  authorEmail: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;

  @Column()
  articleId: string;

  // Optional: Website URL
  @Column({ nullable: true, length: 255 })
  website?: string;

  // Virtual field for avatar (generated from email using Gravatar)
  get avatarUrl(): string {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(this.authorEmail.toLowerCase().trim()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
  }
}
