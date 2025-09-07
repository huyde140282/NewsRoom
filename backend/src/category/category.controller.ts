import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpStatus,
  HttpCode,
  Req,
  Version,
  UseInterceptors
} from '@nestjs/common';
import { Request } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@Controller('categories')
@UseInterceptors(ResponseInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Version('1')
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const categories = await this.categoryService.findAll();
    
    return new ApiResponse(
      categories,
      {
        total: categories.length,
        count: categories.length,
      },
      {
        self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      },
      'Categories retrieved successfully'
    );
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('slug') slug: string) {
    const category = await this.categoryService.findBySlug(slug);
    
    return new ApiResponse(
      category,
      undefined,
      undefined,
      'Category retrieved successfully'
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    
    return new ApiResponse(
      category,
      undefined,
      undefined,
      'Category created successfully'
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const category = await this.categoryService.update(id, updateCategoryDto);
    
    return new ApiResponse(
      category,
      undefined,
      undefined,
      'Category updated successfully'
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
    
    return new ApiResponse(
      null,
      undefined,
      undefined,
      'Category deleted successfully'
    );
  }
}
