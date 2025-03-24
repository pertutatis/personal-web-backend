-- Add excerpt column to articles
ALTER TABLE articles
ADD COLUMN excerpt TEXT NOT NULL DEFAULT '';

-- Create index on excerpt for potential future searching
CREATE INDEX IF NOT EXISTS articles_excerpt_idx ON articles (excerpt);

-- Comment on excerpt column to document its purpose
COMMENT ON COLUMN articles.excerpt IS 'A brief summary or preview of the article content';
