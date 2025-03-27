import { ArticleRelatedLinkMother } from './mothers/ArticleRelatedLinkMother';
import { ArticleRelatedLinks } from '../ArticleRelatedLinks';
import { ArticleRelatedLinksDuplicated } from '../ArticleRelatedLinksDuplicated';
import { ArticleRelatedLinksMaxExceeded } from '../ArticleRelatedLinksMaxExceeded';

describe('ArticleRelatedLinks', () => {
  it('should create empty related links', () => {
    const links = ArticleRelatedLinks.createEmpty();
    expect(links.length).toBe(0);
    expect(links.isEmpty).toBe(true);
  });

  it('should create with valid links', () => {
    const links = ArticleRelatedLinks.create([
      { text: 'Link 1', url: 'https://example.com/1' },
      { text: 'Link 2', url: 'https://example.com/2' }
    ]);

    expect(links.length).toBe(2);
    expect(links.isEmpty).toBe(false);
  });

  it('should add a new link', () => {
    const links = ArticleRelatedLinks.create([
      { text: 'Link 1', url: 'https://example.com/1' }
    ]);

    const newLink = {
      text: 'New Link',
      url: 'https://example.com/new'
    };

    const updatedLinks = links.add(newLink);
    expect(updatedLinks.length).toBe(2);
    expect(updatedLinks.getItems()[1].getUrl()).toBe(newLink.url);
  });

  it('should remove a link', () => {
    const firstLink = { text: 'Link 1', url: 'https://example.com/1' };
    const secondLink = { text: 'Link 2', url: 'https://example.com/2' };

    const links = ArticleRelatedLinks.create([firstLink, secondLink]);

    const updatedLinks = links.remove(firstLink.url);
    expect(updatedLinks.length).toBe(1);
    expect(updatedLinks.getItems()[0].getUrl()).not.toBe(firstLink.url);
  });

  it('should detect duplicated links', () => {
    const links = ArticleRelatedLinks.create([
      { text: 'Link 1', url: 'https://example.com/1' }
    ]);

    const newLink = {
      text: 'New Link',
      url: 'https://example.com/1'
    };

    expect(() => links.add(newLink)).toThrow(ArticleRelatedLinksDuplicated);
  });

  it('should remove correct link when multiple exist', () => {
    const firstLink = { text: 'Link 1', url: 'https://example.com/1' };
    const secondLink = { text: 'Link 2', url: 'https://example.com/2' };
    const thirdLink = { text: 'Link 3', url: 'https://example.com/3' };

    const links = ArticleRelatedLinks.create([firstLink, secondLink, thirdLink]);

    const updatedLinks = links.remove(firstLink.url);
    expect(updatedLinks.length).toBe(2);
    expect(updatedLinks.hasUrl(firstLink.url)).toBe(false);
    expect(updatedLinks.hasUrl(secondLink.url)).toBe(true);
    expect(updatedLinks.hasUrl(thirdLink.url)).toBe(true);
  });

  it('should implement equals correctly', () => {
    const links1 = ArticleRelatedLinks.create([
      { text: 'Link 1', url: 'https://example.com/1' },
      { text: 'Link 2', url: 'https://example.com/2' }
    ]);

    const links2 = ArticleRelatedLinks.create([
      { text: 'Link 1', url: 'https://example.com/1' },
      { text: 'Link 2', url: 'https://example.com/2' }
    ]);

    const differentLinks = ArticleRelatedLinks.create([
      { text: 'Link 3', url: 'https://example.com/3' }
    ]);

    expect(links1.equals(links2)).toBe(true);
    expect(links1.equals(differentLinks)).toBe(false);
    expect(links1.equals(null)).toBe(false);
  });

  it('should convert to string', () => {
    const links = ArticleRelatedLinks.create([
      { text: 'Link 1', url: 'https://example.com/1' },
      { text: 'Link 2', url: 'https://example.com/2' }
    ]);

    const str = links.toString();
    links.getItems().forEach(link => {
      expect(str).toContain(link.getText());
      expect(str).toContain(link.getUrl());
    });
  });

  it('should throw error when exceeding max links', () => {
    const maxLinks = Array.from({ length: ArticleRelatedLinks.MAX_LINKS + 1 }, (_, i) => ({
      text: `Link ${i + 1}`,
      url: `https://example.com/${i + 1}`
    }));

    expect(() => ArticleRelatedLinks.create(maxLinks)).toThrow(ArticleRelatedLinksMaxExceeded);
  });
});
