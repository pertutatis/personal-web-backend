-- Create article_series table
CREATE TABLE article_series (
  id UUID PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Add series_id to articles table
ALTER TABLE articles ADD COLUMN series_id UUID REFERENCES article_series(id);
CREATE INDEX idx_articles_series ON articles(series_id);

-- Create reverse migration
-- Down
-- ALTER TABLE articles DROP COLUMN series_id;
-- DROP TABLE article_series;
