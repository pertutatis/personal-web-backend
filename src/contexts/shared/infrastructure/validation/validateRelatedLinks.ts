import { RelatedLinksValidationError } from '@/contexts/backoffice/article/domain/validation/errors/RelatedLinksValidationError';

export interface RelatedLink {
  text: string;
  url: string;
}

export function validateRelatedLinks(links: RelatedLink[]): void {
  if (!Array.isArray(links)) {
    throw new RelatedLinksValidationError(
      'RELATED_LINKS_NOT_ARRAY',
      'relatedLinks must be an array'
    );
  }

  if (links.length > 10) {
    throw new RelatedLinksValidationError(
      'RELATED_LINKS_MAX_EXCEEDED',
      'Cannot have more than 10 related links'
    );
  }

  const urls = new Set<string>();

  links.forEach((link, index) => {
    if (!link || typeof link !== 'object') {
      throw new RelatedLinksValidationError(
        'RELATED_LINK_INVALID',
        `relatedLinks[${index}] must be an object`
      );
    }

    if (typeof link.text !== 'string' || link.text.trim().length === 0) {
      throw new RelatedLinksValidationError(
        'RELATED_LINK_TEXT_EMPTY',
        `relatedLinks[${index}].text cannot be empty`
      );
    }

    if (link.text.length > 100) {
      throw new RelatedLinksValidationError(
        'RELATED_LINK_TEXT_TOO_LONG',
        `relatedLinks[${index}].text exceeds maximum length of 100 characters`
      );
    }

    if (typeof link.url !== 'string' || link.url.trim().length === 0) {
      throw new RelatedLinksValidationError(
        'RELATED_LINK_URL_EMPTY',
        `relatedLinks[${index}].url cannot be empty`
      );
    }

    if (link.url.length > 2000) {
      throw new RelatedLinksValidationError(
        'RELATED_LINK_URL_TOO_LONG',
        `relatedLinks[${index}].url exceeds maximum length of 2000 characters`
      );
    }

    try {
      new URL(link.url);
    } catch {
      throw new RelatedLinksValidationError(
        'RELATED_LINK_URL_INVALID',
        `relatedLinks[${index}].url is not a valid URL`
      );
    }

    if (urls.has(link.url)) {
      throw new RelatedLinksValidationError(
        'RELATED_LINKS_DUPLICATED',
        'Duplicate URLs are not allowed in relatedLinks'
      );
    }
    urls.add(link.url);
  });
}
