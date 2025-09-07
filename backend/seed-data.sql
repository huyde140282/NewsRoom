-- Seed Users
INSERT INTO users (id, username, email, password, "firstName", "lastName", role, "isActive", "emailVerified", "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'admin', 'admin@newsroom.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LvStJNKPAytHXOlPa', 'Admin', 'User', 'admin', true, true, NOW(), NOW()),
(gen_random_uuid(), 'johndoe', 'john@newsroom.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LvStJNKPAytHXOlPa', 'John', 'Doe', 'user', true, true, NOW(), NOW()),
(gen_random_uuid(), 'janesmith', 'jane@newsroom.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LvStJNKPAytHXOlPa', 'Jane', 'Smith', 'user', true, true, NOW(), NOW()),
(gen_random_uuid(), 'techwriter', 'tech@newsroom.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LvStJNKPAytHXOlPa', 'Alex', 'Tech Writer', 'user', true, true, NOW(), NOW()),
(gen_random_uuid(), 'sportswriter', 'sports@newsroom.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LvStJNKPAytHXOlPa', 'Mike', 'Sports Writer', 'user', true, true, NOW(), NOW());

-- Seed Categories
INSERT INTO categories (id, name, slug, description, color, icon, "isActive", "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'Technology', 'technology', 'Latest technology news and innovations', '#3b82f6', 'computer', true, NOW(), NOW()),
(gen_random_uuid(), 'Business', 'business', 'Business and finance news', '#f59e0b', 'briefcase', true, NOW(), NOW()),
(gen_random_uuid(), 'Sports', 'sports', 'Sports news and updates', '#ef4444', 'trophy', true, NOW(), NOW()),
(gen_random_uuid(), 'Entertainment', 'entertainment', 'Entertainment and celebrity news', '#8b5cf6', 'film', true, NOW(), NOW()),
(gen_random_uuid(), 'Health', 'health', 'Health and wellness news', '#10b981', 'heart', true, NOW(), NOW()),
(gen_random_uuid(), 'Science', 'science', 'Scientific discoveries and research', '#06b6d4', 'microscope', true, NOW(), NOW());

-- Seed Tags
INSERT INTO tags (id, name, slug, color, "createdAt") VALUES
(gen_random_uuid(), 'AI', 'ai', '#3b82f6', NOW()),
(gen_random_uuid(), 'Machine Learning', 'machine-learning', '#3b82f6', NOW()),
(gen_random_uuid(), 'Blockchain', 'blockchain', '#f59e0b', NOW()),
(gen_random_uuid(), 'Cryptocurrency', 'cryptocurrency', '#f59e0b', NOW()),
(gen_random_uuid(), 'Startup', 'startup', '#10b981', NOW()),
(gen_random_uuid(), 'Investment', 'investment', '#10b981', NOW()),
(gen_random_uuid(), 'Football', 'football', '#ef4444', NOW()),
(gen_random_uuid(), 'Basketball', 'basketball', '#ef4444', NOW()),
(gen_random_uuid(), 'Movies', 'movies', '#8b5cf6', NOW()),
(gen_random_uuid(), 'Music', 'music', '#8b5cf6', NOW()),
(gen_random_uuid(), 'Fitness', 'fitness', '#10b981', NOW()),
(gen_random_uuid(), 'Nutrition', 'nutrition', '#10b981', NOW()),
(gen_random_uuid(), 'Research', 'research', '#06b6d4', NOW()),
(gen_random_uuid(), 'Innovation', 'innovation', '#06b6d4', NOW()),
(gen_random_uuid(), 'Breaking', 'breaking', '#ef4444', NOW()),
(gen_random_uuid(), 'Trending', 'trending', '#f59e0b', NOW());

-- Seed Articles with realistic content
INSERT INTO articles (id, title, slug, excerpt, content, "featuredImage", status, "viewCount", "publishedAt", "createdAt", "updatedAt", "authorId", "categoryId") VALUES
(
  gen_random_uuid(),
  'Revolutionary AI Technology Transforms Healthcare Industry',
  'revolutionary-ai-technology-transforms-healthcare',
  'New artificial intelligence breakthrough promises to revolutionize patient care and medical diagnosis with unprecedented accuracy.',
  '<p>The healthcare industry is experiencing a revolutionary transformation thanks to cutting-edge artificial intelligence technology. Recent breakthroughs in machine learning algorithms have enabled medical professionals to diagnose diseases with unprecedented accuracy and speed.</p><p>Dr. Sarah Johnson, lead researcher at the Medical AI Institute, explains: "This technology can analyze medical scans in seconds and identify patterns that might take human doctors hours to detect. The accuracy rate is now over 95%, which is remarkable."</p><h3>Key Benefits</h3><ul><li>Faster diagnosis and treatment</li><li>Reduced medical errors</li><li>Lower healthcare costs</li><li>Improved patient outcomes</li></ul>',
  '/uploads/articles/ai-healthcare.jpg',
  'published',
  1250,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  (SELECT id FROM users WHERE username = 'techwriter'),
  (SELECT id FROM categories WHERE slug = 'technology')
),
(
  gen_random_uuid(),
  'Cryptocurrency Market Reaches All-Time High',
  'cryptocurrency-market-reaches-all-time-high',
  'Bitcoin and other major cryptocurrencies surge as institutional investors show renewed interest in digital assets.',
  '<p>The cryptocurrency market has reached unprecedented heights this week, with Bitcoin leading the charge to new all-time highs. The surge comes amid growing institutional adoption and regulatory clarity in major markets.</p><p>Market analyst Michael Chen notes: "We''re seeing a fundamental shift in how institutional investors view cryptocurrency. What was once considered speculative is now being treated as a legitimate asset class."</p>',
  '/uploads/articles/crypto-surge.jpg',
  'published',
  980,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days',
  (SELECT id FROM users WHERE username = 'johndoe'),
  (SELECT id FROM categories WHERE slug = 'business')
);

-- Seed Article-Tag relationships
INSERT INTO article_tags ("articleId", "tagId") VALUES
((SELECT id FROM articles WHERE slug = 'revolutionary-ai-technology-transforms-healthcare'), (SELECT id FROM tags WHERE slug = 'ai')),
((SELECT id FROM articles WHERE slug = 'revolutionary-ai-technology-transforms-healthcare'), (SELECT id FROM tags WHERE slug = 'machine-learning')),
((SELECT id FROM articles WHERE slug = 'revolutionary-ai-technology-transforms-healthcare'), (SELECT id FROM tags WHERE slug = 'innovation')),
((SELECT id FROM articles WHERE slug = 'cryptocurrency-market-reaches-all-time-high'), (SELECT id FROM tags WHERE slug = 'blockchain')),
((SELECT id FROM articles WHERE slug = 'cryptocurrency-market-reaches-all-time-high'), (SELECT id FROM tags WHERE slug = 'cryptocurrency')),
((SELECT id FROM articles WHERE slug = 'cryptocurrency-market-reaches-all-time-high'), (SELECT id FROM tags WHERE slug = 'investment'));

-- Seed Comments
INSERT INTO comments (id, "articleId", "authorId", content, "isApproved", "createdAt", "updatedAt") VALUES
(gen_random_uuid(), (SELECT id FROM articles WHERE slug = 'revolutionary-ai-technology-transforms-healthcare'), (SELECT id FROM users WHERE username = 'johndoe'), 'This is fascinating! The potential for AI in healthcare is truly limitless.', true, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM articles WHERE slug = 'cryptocurrency-market-reaches-all-time-high'), (SELECT id FROM users WHERE username = 'janesmith'), 'Great analysis on the crypto market. I have been following these trends closely.', true, NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM articles WHERE slug = 'revolutionary-ai-technology-transforms-healthcare'), (SELECT id FROM users WHERE username = 'techwriter'), 'I agree! The healthcare applications are mind-blowing.', true, NOW(), NOW());
