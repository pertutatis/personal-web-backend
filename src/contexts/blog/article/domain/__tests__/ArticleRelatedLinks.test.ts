import { ArticleRelatedLinkMother } from './mothers/ArticleRelatedLinkMother';
import { ArticleRelatedLinksMother } from './mothers/ArticleRelatedLinksMother';
import { ArticleRelatedLinksMaxExceeded } from '../ArticleRelatedLinksMaxExceeded';
import { ArticleRelatedLinksDuplicated } from '../ArticleRelatedLinksDuplicated';

describe('ArticleRelatedLinks', () => {
  it('should create a valid collection of related links', () => {
    const links = ArticleRelatedLinksMother.create();
    expect(links.length).toBe(2);
    expect(links.isEmpty).toBe(false);
  });

  it('should create an empty collection', () => {
    const links = ArticleRelatedLinksMother.empty();
    expect(links.length).toBe(0);
    expect(links.isEmpty).toBe(true);
  });

  it('should throw error when exceeding max links', () => {
    expect(() => {
      ArticleRelatedLinksMother.exceedingMaxLinks();
    }).toThrow(ArticleRelatedLinksMaxExceeded);
  });

  it('should accept exactly max number of links', () => {
    const links = ArticleRelatedLinksMother.maxLinks();
    expect(links.length).toBe(10);
  });

  it('should throw error on duplicate URLs', () => {
    expect(() => {
      ArticleRelatedLinksMother.withDuplicates();
    }).toThrow(ArticleRelatedLinksDuplicated);
  });

  it('should convert to primitives correctly', () => {
    const links = ArticleRelatedLinksMother.create(2);
    const primitives = links.toPrimitives();
    
    expect(primitives).toHaveLength(2);
    expect(primitives[0]).toEqual({
      text: 'Link 1',
      url: 'https://example.com/path-1'
    });
    expect(primitives[1]).toEqual({
      text: 'Link 2',
      url: 'https://example.com/path-2'
    });
  });

  it('should allow adding new links', () => {
    const links = ArticleRelatedLinksMother.create(1);
    const newLink = ArticleRelatedLinkMother.create('New Link', 'https://example.com/new');
    
    const updatedLinks = links.add(newLink);
    expect(updatedLinks.length).toBe(2);
    expect(updatedLinks.toPrimitives()).toContainEqual({
      text: 'New Link',
      url: 'https://example.com/new'
    });
  });

  it('should allow removing links', () => {
    const links = ArticleRelatedLinksMother.create(2);
    const urlToRemove = 'https://example.com/path-1';
    
    const updatedLinks = links.remove(urlToRemove);
    expect(updatedLinks.length).toBe(1);
    expect(updatedLinks.toPrimitives()).not.toContainEqual(expect.objectContaining({
      url: urlToRemove
    }));
  });

  it('should ignore removing non-existent links', () => {
    const links = ArticleRelatedLinksMother.create(2);
    const urlToRemove = 'https://example.com/non-existent';
    
    const updatedLinks = links.remove(urlToRemove);
    expect(updatedLinks.length).toBe(2);
  });

  it('should throw error when adding link that would exceed max', () => {
    const links = ArticleRelatedLinksMother.maxLinks();
    const newLink = ArticleRelatedLinkMother.create('Extra Link', 'https://example.com/extra');
    
    expect(() => {
      links.add(newLink);
    }).toThrow(ArticleRelatedLinksMaxExceeded);
  });

  it('should throw error when adding duplicate URL', () => {
    const links = ArticleRelatedLinksMother.create(1);
    const duplicateLink = ArticleRelatedLinkMother.create('Duplicate', 'https://example.com/path-1');
    
    expect(() => {
      links.add(duplicateLink);
    }).toThrow(ArticleRelatedLinksDuplicated);
  });
});
