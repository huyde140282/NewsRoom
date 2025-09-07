import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Article } from './article.entity';

@Entity('categories')
@Tree('closure-table')
@Index(['slug'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Tree relations
  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  // Relations
  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];

  // Virtual field for article count
  articleCount?: number;
}
