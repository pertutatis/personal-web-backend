import { ArticleStatus } from '../ArticleStatus'
import { ArticleStatusMother } from './mothers/ArticleStatusMother'
import { ArticleStatusInvalid } from '../ArticleStatusInvalid'

describe('ArticleStatus', () => {
  describe('valid status creation', () => {
    it('should create DRAFT status', () => {
      const status = ArticleStatusMother.draft()
      expect(status.value).toBe('DRAFT')
      expect(status.isDraft()).toBe(true)
      expect(status.isPublished()).toBe(false)
    })

    it('should create PUBLISHED status', () => {
      const status = ArticleStatusMother.published()
      expect(status.value).toBe('PUBLISHED')
      expect(status.isDraft()).toBe(false)
      expect(status.isPublished()).toBe(true)
    })

    it('should create default DRAFT status', () => {
      const status = ArticleStatusMother.default()
      expect(status.value).toBe('DRAFT')
      expect(status.isDraft()).toBe(true)
    })
  })

  describe('status validation', () => {
    it('should throw error for invalid status value', () => {
      expect(() => ArticleStatusMother.invalid()).toThrow(ArticleStatusInvalid)
    })

    it('should throw error for empty status', () => {
      expect(() => ArticleStatusMother.empty()).toThrow(ArticleStatusInvalid)
    })

    it('should throw error for null status', () => {
      expect(() => ArticleStatusMother.nullValue()).toThrow(ArticleStatusInvalid)
    })

    it('should be case sensitive', () => {
      expect(() => ArticleStatusMother.lowerCase()).toThrow(ArticleStatusInvalid)
    })
  })

  describe('status transitions', () => {
    it('should allow transition from DRAFT to PUBLISHED', () => {
      const draftStatus = ArticleStatusMother.draft()
      const publishedStatus = draftStatus.publish()
      
      expect(publishedStatus.value).toBe('PUBLISHED')
      expect(publishedStatus.isPublished()).toBe(true)
    })

    it('should not allow transition from PUBLISHED to DRAFT', () => {
      const publishedStatus = ArticleStatusMother.published()
      
      expect(() => publishedStatus.toDraft()).toThrow(ArticleStatusInvalid)
    })

    it('should allow DRAFT to remain DRAFT', () => {
      const draftStatus = ArticleStatusMother.draft()
      const sameDraftStatus = draftStatus.keepDraft()
      
      expect(sameDraftStatus.value).toBe('DRAFT')
      expect(sameDraftStatus.isDraft()).toBe(true)
    })

    it('should allow PUBLISHED to remain PUBLISHED', () => {
      const publishedStatus = ArticleStatusMother.published()
      const samePublishedStatus = publishedStatus.keepPublished()
      
      expect(samePublishedStatus.value).toBe('PUBLISHED')
      expect(samePublishedStatus.isPublished()).toBe(true)
    })
  })

  describe('string conversions', () => {
    it('should convert DRAFT to string correctly', () => {
      const status = ArticleStatusMother.draft()
      expect(status.toString()).toBe('DRAFT')
    })

    it('should convert PUBLISHED to string correctly', () => {
      const status = ArticleStatusMother.published()
      expect(status.toString()).toBe('PUBLISHED')
    })

    it('should convert to JSON correctly', () => {
      const draftStatus = ArticleStatusMother.draft()
      const publishedStatus = ArticleStatusMother.published()
      
      expect(draftStatus.toJSON()).toBe('DRAFT')
      expect(publishedStatus.toJSON()).toBe('PUBLISHED')
    })
  })

  describe('equality', () => {
    it('should be equal to another status with same value', () => {
      const status1 = ArticleStatusMother.draft()
      const status2 = ArticleStatusMother.draft()
      expect(status1.equals(status2)).toBe(true)
    })

    it('should not be equal to status with different value', () => {
      const draftStatus = ArticleStatusMother.draft()
      const publishedStatus = ArticleStatusMother.published()
      expect(draftStatus.equals(publishedStatus)).toBe(false)
    })

    it('should not be equal to null', () => {
      const status = ArticleStatusMother.draft()
      expect(status.equals(null as any)).toBe(false)
    })

    it('should not be equal to different type', () => {
      const status = ArticleStatusMother.draft()
      expect(status.equals('DRAFT' as any)).toBe(false)
    })
  })

  describe('status constants', () => {
    it('should have DRAFT constant', () => {
      expect(ArticleStatus.DRAFT).toBe('DRAFT')
    })

    it('should have PUBLISHED constant', () => {
      expect(ArticleStatus.PUBLISHED).toBe('PUBLISHED')
    })

    it('should have valid values array', () => {
      expect(ArticleStatus.VALID_VALUES).toEqual(['DRAFT', 'PUBLISHED'])
    })
  })

  describe('factory methods', () => {
    it('should create DRAFT using factory method', () => {
      const status = ArticleStatus.createDraft()
      expect(status.value).toBe('DRAFT')
      expect(status.isDraft()).toBe(true)
    })

    it('should create PUBLISHED using factory method', () => {
      const status = ArticleStatus.createPublished()
      expect(status.value).toBe('PUBLISHED')
      expect(status.isPublished()).toBe(true)
    })

    it('should create from valid string', () => {
      const draftStatus = ArticleStatus.fromString('DRAFT')
      const publishedStatus = ArticleStatus.fromString('PUBLISHED')
      
      expect(draftStatus.isDraft()).toBe(true)
      expect(publishedStatus.isPublished()).toBe(true)
    })

    it('should throw error when creating from invalid string', () => {
      expect(() => ArticleStatus.fromString('INVALID')).toThrow(ArticleStatusInvalid)
    })
  })
}) 