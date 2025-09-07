import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class DatabaseSeederService {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async seedIfEmpty(): Promise<void> {
    try {
      // Check if data already exists
      const categoriesCount = await this.dataSource.query('SELECT COUNT(*) FROM categories');
      const usersCount = await this.dataSource.query('SELECT COUNT(*) FROM users');
      
      if (parseInt(categoriesCount[0].count) > 0 && parseInt(usersCount[0].count) > 0) {
        this.logger.log('✅ Database already has data, skipping seed');
        return;
      }

      this.logger.log('🌱 Starting database seeding...');
      await this.seedData();
      this.logger.log('✅ Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error during database seeding:', error);
      // Don't throw error to prevent app startup failure
    }
  }

  private async seedData(): Promise<void> {
    // Insert Categories
    await this.dataSource.query(`
      INSERT INTO categories (id, name, slug, description, color, icon, "isActive", "createdAt", "updatedAt") VALUES
      (gen_random_uuid(), 'Technology', 'technology', 'Latest technology news, innovations, AI, and digital trends', '#3b82f6', 'computer', true, NOW(), NOW()),
      (gen_random_uuid(), 'Business', 'business', 'Business news, finance, markets, and entrepreneurship', '#f59e0b', 'briefcase', true, NOW(), NOW()),
      (gen_random_uuid(), 'Sports', 'sports', 'Sports news, fitness, training, and athletic achievements', '#ef4444', 'trophy', true, NOW(), NOW()),
      (gen_random_uuid(), 'Entertainment', 'entertainment', 'Entertainment news, music, movies, and celebrity updates', '#8b5cf6', 'film', true, NOW(), NOW()),
      (gen_random_uuid(), 'Health', 'health', 'Health and wellness news, medical breakthroughs, and fitness tips', '#10b981', 'heart', true, NOW(), NOW()),
      (gen_random_uuid(), 'Science', 'science', 'Scientific discoveries, research, and innovation updates', '#06b6d4', 'microscope', true, NOW(), NOW())
    `);
    this.logger.log('Categories seeded');

    // Insert Tags
    await this.dataSource.query(`
      INSERT INTO tags (id, name, slug, color, "createdAt") VALUES
      (gen_random_uuid(), 'AI', 'ai', '#3b82f6', NOW()),
      (gen_random_uuid(), 'Machine Learning', 'machine-learning', '#3b82f6', NOW()),
      (gen_random_uuid(), 'Startup', 'startup', '#10b981', NOW()),
      (gen_random_uuid(), 'Fitness', 'fitness', '#10b981', NOW()),
      (gen_random_uuid(), 'Music', 'music', '#8b5cf6', NOW()),
      (gen_random_uuid(), 'Innovation', 'innovation', '#06b6d4', NOW()),
      (gen_random_uuid(), 'Breaking', 'breaking', '#ef4444', NOW()),
      (gen_random_uuid(), 'Trending', 'trending', '#f59e0b', NOW())
    `);
    this.logger.log('Tags seeded');

    // Insert Users
    await this.dataSource.query(`
      INSERT INTO users (id, username, email, password, "firstName", "lastName", role, "isActive", "emailVerified", "createdAt", "updatedAt") VALUES
      (gen_random_uuid(), 'newsroom', 'newsroom@system.com', 'dummy', 'NewsRoom', 'System', 'user', true, true, NOW(), NOW()),
      (gen_random_uuid(), 'admin', 'admin@newsroom.com', 'admin123', 'Admin', 'User', 'admin', true, true, NOW(), NOW()),
      (gen_random_uuid(), 'john_doe', 'john@example.com', 'password123', 'John', 'Doe', 'user', true, true, NOW(), NOW()),
      (gen_random_uuid(), 'jane_smith', 'jane@example.com', 'password123', 'Jane', 'Smith', 'user', true, true, NOW(), NOW())
    `);
    this.logger.log('Users seeded');

    // Insert Articles
    const articles = [
      {
        title: 'Revolutionary AI Technology Transforms Healthcare Industry',
        slug: 'revolutionary-ai-technology-transforms-healthcare',
        excerpt: 'New artificial intelligence breakthrough promises to revolutionize patient care and medical diagnostics.',
        content: '<p>The healthcare industry is experiencing a revolutionary transformation thanks to cutting-edge artificial intelligence technology. Recent breakthroughs in machine learning algorithms have enabled unprecedented accuracy in medical diagnosis, patient monitoring, and treatment recommendations.</p><p>Leading medical institutions worldwide are now implementing AI-powered systems that can analyze medical images, predict patient outcomes, and assist doctors in making more informed decisions. This technology is not only improving patient care but also reducing healthcare costs and increasing efficiency across medical facilities.</p>',
        image: '/uploads/abstract-technology-device.png',
        category: 'technology',
        views: 1250
      },
      {
        title: 'Business Meeting Collaboration Strategies for Modern Teams',
        slug: 'business-meeting-collaboration-strategies-modern-teams',
        excerpt: 'Discover effective collaboration strategies that modern business teams use to achieve success.',
        content: '<p>In today\'s fast-paced business environment, effective collaboration has become essential for team success. Modern businesses are adopting innovative strategies that leverage both technology and human-centered approaches to enhance productivity and teamwork.</p><p>From virtual reality meeting spaces to AI-powered project management tools, companies are exploring new ways to bring teams together and streamline their workflow processes. These strategies are proving particularly valuable for remote and hybrid work environments.</p>',
        image: '/uploads/business-meeting-collaboration.png',
        category: 'business',
        views: 980
      },
      {
        title: 'Diverse Fitness Training: Complete Workout Guide',
        slug: 'diverse-fitness-training-complete-workout-guide',
        excerpt: 'A comprehensive guide to diverse fitness training methods for all fitness levels.',
        content: '<p>Fitness training has evolved significantly over the years with diverse methodologies emerging to cater to different fitness goals and preferences. From high-intensity interval training (HIIT) to mindful yoga practices, there\'s never been a better time to explore various approaches to physical wellness.</p><p>This comprehensive guide covers everything from strength training and cardiovascular exercises to flexibility and mobility work, ensuring that everyone can find a fitness routine that suits their lifestyle and goals.</p>',
        image: '/uploads/diverse-fitness-training.png',
        category: 'sports',
        views: 850
      },
      {
        title: 'Entertainment Music Industry Trends Analysis',
        slug: 'entertainment-music-industry-trends-analysis',
        excerpt: 'An in-depth analysis of current music industry trends and future predictions.',
        content: '<p>The music industry continues to evolve at a rapid pace, driven by technological innovations and changing consumer preferences. Streaming platforms have fundamentally altered how music is distributed and consumed, while social media has created new opportunities for artists to connect with their audiences.</p><p>From the rise of AI-generated music to the growing importance of live streaming concerts, industry professionals must stay ahead of these trends to remain competitive in this dynamic landscape.</p>',
        image: '/uploads/entertainment-music.jpg',
        category: 'entertainment',
        views: 720
      },
      {
        title: 'Latest Technology News and Innovation Updates',
        slug: 'latest-technology-news-innovation-updates',
        excerpt: 'Stay updated with the latest technology news and breakthrough innovations.',
        content: '<p>Technology continues to advance at an unprecedented rate, with new innovations emerging daily across various sectors. From quantum computing breakthroughs to sustainable energy solutions, the technology landscape is constantly evolving.</p><p>This week\'s highlights include major developments in artificial intelligence, blockchain technology, and renewable energy systems that promise to shape our future in significant ways.</p>',
        image: '/uploads/technology-news-collage.png',
        category: 'technology',
        views: 1100
      }
    ];

    for (const article of articles) {
      await this.dataSource.query(`
        INSERT INTO articles (id, title, slug, excerpt, content, "featuredImage", status, "viewCount", "publishedAt", "createdAt", "updatedAt", "authorId", "categoryId") VALUES
        (
          gen_random_uuid(),
          $1, $2, $3, $4, $5,
          'published',
          $6,
          NOW(), NOW(), NOW(),
          (SELECT id FROM users WHERE username = 'newsroom'),
          (SELECT id FROM categories WHERE slug = $7)
        )
      `, [article.title, article.slug, article.excerpt, article.content, article.image, article.views, article.category]);
    }
    this.logger.log('Articles seeded');

    // Insert Article Tags
    await this.dataSource.query(`
      INSERT INTO article_tags ("articleId", "tagId") VALUES
      ((SELECT id FROM articles WHERE slug = 'revolutionary-ai-technology-transforms-healthcare'), (SELECT id FROM tags WHERE slug = 'ai')),
      ((SELECT id FROM articles WHERE slug = 'revolutionary-ai-technology-transforms-healthcare'), (SELECT id FROM tags WHERE slug = 'innovation')),
      ((SELECT id FROM articles WHERE slug = 'revolutionary-ai-technology-transforms-healthcare'), (SELECT id FROM tags WHERE slug = 'breaking')),
      ((SELECT id FROM articles WHERE slug = 'business-meeting-collaboration-strategies-modern-teams'), (SELECT id FROM tags WHERE slug = 'startup')),
      ((SELECT id FROM articles WHERE slug = 'business-meeting-collaboration-strategies-modern-teams'), (SELECT id FROM tags WHERE slug = 'innovation')),
      ((SELECT id FROM articles WHERE slug = 'diverse-fitness-training-complete-workout-guide'), (SELECT id FROM tags WHERE slug = 'fitness')),
      ((SELECT id FROM articles WHERE slug = 'diverse-fitness-training-complete-workout-guide'), (SELECT id FROM tags WHERE slug = 'trending')),
      ((SELECT id FROM articles WHERE slug = 'entertainment-music-industry-trends-analysis'), (SELECT id FROM tags WHERE slug = 'music')),
      ((SELECT id FROM articles WHERE slug = 'entertainment-music-industry-trends-analysis'), (SELECT id FROM tags WHERE slug = 'trending')),
      ((SELECT id FROM articles WHERE slug = 'latest-technology-news-innovation-updates'), (SELECT id FROM tags WHERE slug = 'ai')),
      ((SELECT id FROM articles WHERE slug = 'latest-technology-news-innovation-updates'), (SELECT id FROM tags WHERE slug = 'innovation'))
    `);
    this.logger.log('Article tags seeded');

    // Insert Comments
    await this.dataSource.query(`
      INSERT INTO comments (id, content, "isApproved", "createdAt", "updatedAt", "articleId", "authorName", "authorEmail") VALUES
      (gen_random_uuid(), 'Fantastic article about AI in healthcare! This technology will definitely change how we approach medical diagnosis and treatment.', true, NOW(), NOW(), (SELECT id FROM articles WHERE slug = 'revolutionary-ai-technology-transforms-healthcare'), 'Dr. Emily Chen', 'emily.chen@hospital.com'),
      (gen_random_uuid(), 'Very insightful business strategies. Our team has been implementing some of these collaboration techniques with great success.', true, NOW(), NOW(), (SELECT id FROM articles WHERE slug = 'business-meeting-collaboration-strategies-modern-teams'), 'Alex Johnson', 'alex@techstartup.io'),
      (gen_random_uuid(), 'Excellent fitness guide! I appreciate the comprehensive approach to different training methods.', true, NOW(), NOW(), (SELECT id FROM articles WHERE slug = 'diverse-fitness-training-complete-workout-guide'), 'Mike Trainer', 'mike@fitnessstudio.com'),
      (gen_random_uuid(), 'The music industry is indeed changing rapidly. Streaming has completely transformed how we discover and consume music.', true, NOW(), NOW(), (SELECT id FROM articles WHERE slug = 'entertainment-music-industry-trends-analysis'), 'Jake Indie', 'jake@indiemusic.net'),
      (gen_random_uuid(), 'Great coverage of the latest tech trends! Looking forward to seeing how these innovations develop.', true, NOW(), NOW(), (SELECT id FROM articles WHERE slug = 'latest-technology-news-innovation-updates'), 'Sarah Tech', 'sarah@techblog.com')
    `);
    this.logger.log('Comments seeded');
  }
}
