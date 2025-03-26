import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export interface RelatedLink {
  text: string;
  url: string;
}

export function validateRelatedLinks(links: RelatedLink[]): void {
  if (!Array.isArray(links)) {
    throw new ValidationError('relatedLinks must be an array');
  }

  if (links.length > 10) {
    throw new ValidationError('Cannot have more than 10 related links');
  }

  const urls = new Set<string>();

  links.forEach((link, index) => {
    if (!link || typeof link !== 'object') {
      throw new ValidationError(`relatedLinks[${index}] must be an object`);
    }

    if (typeof link.text !== 'string' || link.text.trim().length === 0) {
      throw new ValidationError(`relatedLinks[${index}].text cannot be empty`);
    }

    if (link.text.length > 100) {
      throw new ValidationError(`relatedLinks[${index}].text exceeds maximum length of 100 characters`);
    }

    if (typeof link.url !== 'string' || link.url.trim().length === 0) {
      throw new ValidationError(`relatedLinks[${index}].url cannot be empty`);
    }

    if (link.url.length > 2000) {
      throw new ValidationError(`relatedLinks[${index}].url exceeds maximum length of 2000 characters`);
    }

    try {
      new URL(link.url);
    } catch {
      throw new ValidationError(`relatedLinks[${index}].url is not a valid URL`);
    }

    if (urls.has(link.url)) {
      throw new ValidationError('Duplicate URLs are not allowed in relatedLinks');
    }
    urls.add(link.url);
  });
}
