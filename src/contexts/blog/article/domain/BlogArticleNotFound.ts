/**
 * Domain error thrown when a blog article is not found.
 */
export class BlogArticleNotFound extends Error {
  readonly type = 'NotFoundError';

  constructor(slug: string) {
    super(`Blog article with slug "${slug}" not found`);
    this.name = 'BlogArticleNotFound';
  }
}
