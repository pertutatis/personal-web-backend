-- Migration 009: Add published_at column to articles table for publication date tracking
ALTER TABLE articles
ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;

-- Index for efficient ordering/filtering by published date
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles (published_at DESC);

-- Comment for documentation
COMMENT ON COLUMN articles.published_at IS 'Date/time when the article was published and made visible to the public';
