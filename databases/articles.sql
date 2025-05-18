-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    book_ids TEXT[] DEFAULT '{}',
    related_links JSONB DEFAULT '[]',
    slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on title
CREATE INDEX IF NOT EXISTS articles_title_idx ON articles (title);

-- Create index on excerpt for searching
CREATE INDEX IF NOT EXISTS articles_excerpt_idx ON articles (excerpt);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles (slug);

-- Create index on created_at for pagination
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles (created_at DESC);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment to document excerpt column's purpose
COMMENT ON COLUMN articles.excerpt IS 'A brief summary or preview of the article content';

-- Add comment to document related_links column's purpose
COMMENT ON COLUMN articles.related_links IS 'Array of related links with text and URL';

-- Add comment to document slug column's purpose
COMMENT ON COLUMN articles.slug IS 'URL-friendly version of the title';
