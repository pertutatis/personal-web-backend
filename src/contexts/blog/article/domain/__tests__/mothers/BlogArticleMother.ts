import { BlogArticle } from '../../BlogArticle'
import { BlogBookMother } from './BlogBookMother'
import { v4 as uuid } from 'uuid'

export class BlogArticleMother {
  static create(
    id: string = uuid(),
    title: string = 'Clean Code: Writing Maintainable Code',
    excerpt: string = 'A guide to writing clean and maintainable code',
    content: string = 'Full article content about clean code principles',
    books = BlogBookMother.createMultiple(2),
    relatedLinks: Array<{ text: string; url: string }> = [
      { text: 'Clean Code Book', url: 'https://example.com/clean-code' },
      { text: 'SOLID Principles', url: 'https://example.com/solid' },
    ],
    slug: string = 'clean-code-writing-maintainable-code',
    createdAt: Date = new Date('2024-01-01'),
    updatedAt: Date = new Date('2024-01-02'),
    publishedAt?: Date,
    serie?: {
      id: string
      title: string
      description: string
      createdAt: string
      updatedAt: string
    } | null,
  ): BlogArticle {
    return new BlogArticle(
      id,
      title,
      excerpt,
      content,
      books,
      relatedLinks,
      slug,
      createdAt,
      updatedAt,
      publishedAt,
      serie,
    )
  }

  static withoutBooks(): BlogArticle {
    return this.create(
      uuid(),
      'Writing Clean Code',
      'Learn how to write maintainable code',
      'Full article content about clean code',
      [],
      [{ text: 'Clean Code Book', url: 'https://example.com/book' }],
      'writing-clean-code',
      new Date('2024-01-01'),
      new Date('2024-01-02'),
      new Date('2024-01-01'), // publishedAt
    )
  }

  static withoutRelatedLinks(): BlogArticle {
    return this.create(
      uuid(),
      'Writing Clean Code',
      'Learn how to write maintainable code',
      'Full article content about clean code',
      BlogBookMother.createMultiple(2),
      [],
      'writing-clean-code',
      new Date('2024-01-01'),
      new Date('2024-01-02'),
      new Date('2024-01-01'), // publishedAt
    )
  }

  static createMultiple(count: number): BlogArticle[] {
    return Array.from({ length: count }, (_, index) =>
      this.create(
        uuid(),
        `Article ${index + 1}`,
        `Excerpt ${index + 1}`,
        `Content ${index + 1}`,
        BlogBookMother.createMultiple(2),
        [
          {
            text: `Related Link ${index + 1}`,
            url: `https://example.com/link-${index + 1}`,
          },
        ],
        `article-${index + 1}`,
        new Date(`2024-01-0${index + 1}`),
        new Date(`2024-01-0${index + 1}`),
        new Date(`2024-01-0${index + 1}`), // publishedAt
      ),
    )
  }
}
