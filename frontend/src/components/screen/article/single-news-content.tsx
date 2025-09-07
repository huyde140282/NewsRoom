'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatDate } from '@/lib/utils';
import { Article, CommentResponse, api } from '@/lib/api';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';

interface SingleNewsContentProps {
  article: Article;
}

export default function SingleNewsContent({ article }: SingleNewsContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    website: '',
    content: ''
  });
  const [formErrors, setFormErrors] = useState<{
    authorName?: string;
    authorEmail?: string;
    website?: string;
    content?: string;
  }>({});
  const [submitStatus, setSubmitStatus] = useState<{
    success?: string;
    error?: string;
  }>({});

  // Use SWR to fetch comments
  const { data: comments = [], error, mutate: mutateComments } = useSWR(
    `/articles/${article.slug}/comments`,
    () => api.getComments(article.slug),
    {
      fallbackData: [{
        id: '1',
        authorName: `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim() || article.author.username,
        content: "Thank you for reading! I hope you found this article informative and engaging. Feel free to share your thoughts in the comments below.",
        createdAt: article.createdAt,
        avatarUrl: article.author.avatar ? `${process.env.NEXT_PUBLIC_BASE_URL}${article.author.avatar}` : undefined,
      }]
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: {
      authorName?: string;
      authorEmail?: string;
      website?: string;
      content?: string;
    } = {};
    
    if (!formData.authorName.trim()) {
      errors.authorName = 'Name is required';
    }
    
    if (!formData.authorEmail.trim()) {
      errors.authorEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.authorEmail)) {
      errors.authorEmail = 'Please enter a valid email address';
    }
    
    // Website validation - optional but must be valid URL if provided
    if (formData.website.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.website.trim())) {
        errors.website = 'Please enter a valid website URL (e.g., https://example.com)';
      }
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Comment is required';
    } else if (formData.content.length > 1000) {
      errors.content = 'Comment must not exceed 1000 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSubmitStatus({});
    
    try {
      await api.createComment(article.slug, formData);
      setSubmitStatus({ success: 'Your comment has been submitted successfully!' });
      
      // Reset form
      setFormData({
        authorName: '',
        authorEmail: '',
        website: '',
        content: ''
      });
      
      // Refresh comments using SWR mutate
      mutateComments();
    } catch (error) {
      console.error('Failed to submit comment:', error);
      setSubmitStatus({ error: 'Failed to submit your comment. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="bg-white rounded-lg p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        {' / '}
        <Link href="/categories" className="hover:text-gray-700">Category</Link>
        {' / '}
        <Link href={`/category/${article.category.slug}`} className="hover:text-gray-700">{article.category.name}</Link>
        {' / '}
        <span className="text-gray-800">{article.title}</span>
      </nav>

      {/* Article Header */}
      <div className="mb-6">
        {article.featuredImage && (
          <div className="relative h-48 md:h-64 lg:h-80 xl:h-96 mb-4 rounded-lg overflow-hidden">
            <Image 
              src={article.featuredImage ? `${process.env.NEXT_PUBLIC_BASE_URL}${article.featuredImage}` : "/placeholder.svg"} 
              alt={article.title} 
              fill 
              className="object-cover" 
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span 
            className="text-white px-2 py-1 text-xs rounded"
            style={{ backgroundColor: article.category.color || '#dc2626' }}
          >
            {article.category.name}
          </span>
          <span className="text-gray-500 text-sm">
            {formatDate(article.publishedAt || article.createdAt)}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        {article.excerpt && (
          <p className="text-gray-600 leading-relaxed mb-6">
            {article.excerpt}
          </p>
        )}
      </div>

      {/* Article Content */}
      <div className="prose max-w-none mb-8">
        <div 
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-red-600 hover:text-white cursor-pointer transition-colors"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="border-t border-gray-200 pt-6 md:pt-8">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">{comments.length} Comments</h3>

        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 md:gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={comment.avatarUrl || "/placeholder.svg"}
                  alt={comment.authorName || 'Anonymous'}
                  width={48}
                  height={48}
                  className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 rounded-full object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 32px, (max-width: 1024px) 40px, 48px"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-red-600">
                    {comment.authorName || 'Anonymous'}
                  </span>
                  <span className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Form */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
          <h4 className="text-base md:text-lg font-bold mb-4">Leave a comment</h4>

          {submitStatus.success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {submitStatus.success}
            </div>
          )}

          {submitStatus.error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {submitStatus.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input 
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  aria-invalid={!!formErrors.authorName}
                />
                {formErrors.authorName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.authorName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input 
                  type="email" 
                  name="authorEmail"
                  value={formData.authorEmail}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  aria-invalid={!!formErrors.authorEmail}
                />
                {formErrors.authorEmail && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.authorEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <Input 
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Your Website"
                aria-invalid={!!formErrors.website}
              />
              {formErrors.website && (
                <p className="text-red-500 text-xs mt-1">{formErrors.website}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message *</label>
              <Textarea 
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Your Message" 
                rows={5}
                aria-invalid={!!formErrors.content}
              />
              {formErrors.content && (
                <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.content.length}/1000 characters
              </p>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Submitting...' : 'Leave a comment'}
            </Button>
          </form>
        </div>
      </div>
    </article>
  );
}
