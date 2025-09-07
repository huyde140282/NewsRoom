import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    const result = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.articles', 'articles', 'articles.status = :status', { status: 'published' })
      .addSelect('COUNT(articles.id)', 'articleCount')
      .where('category.isActive = :isActive', { isActive: true })
      .groupBy('category.id')
      .orderBy('category.name', 'ASC')
      .getRawAndEntities();

    // Map raw data to entities with articleCount
    const categories = result.entities.map((category, index) => ({
      ...category,
      articleCount: parseInt(result.raw[index].articleCount) || 0,
    }));

    return categories;
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.slug = :slug', { slug })
      .andWhere('category.isActive = :isActive', { isActive: true })
      .getOne();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findById(id: string) {
    const category = await this.categoryRepository.findOne({ 
      where: { id, isActive: true } 
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findById(id);
    await this.categoryRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
