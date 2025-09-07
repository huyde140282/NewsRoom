import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToMany,
} from 'typeorm';
import { Article } from './article.entity';

@Entity('tags')
@Index(['slug'])
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  color?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];

  // Virtual field for article count
  articleCount?: number;
}
