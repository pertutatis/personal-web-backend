-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    book_ids TEXT[] DEFAULT '{}',
    related_links JSONB DEFAULT '[]',
    slug VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT articles_status_check CHECK (status IN ('DRAFT', 'PUBLISHED'))
);

-- Create index on title
CREATE INDEX IF NOT EXISTS articles_title_idx ON articles (title);

-- Create index on excerpt for searching
CREATE INDEX IF NOT EXISTS articles_excerpt_idx ON articles (excerpt);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles (slug);

-- Create index on created_at for pagination
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles (created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles (status);

-- Create composite index for status + created_at for pagination queries
CREATE INDEX IF NOT EXISTS articles_status_created_at_idx ON articles (status, created_at DESC);

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

-- Add comment to document status column's purpose
COMMENT ON COLUMN articles.status IS 'Article status: DRAFT (work in progress) or PUBLISHED (visible to public)';

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    purchase_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on title
CREATE INDEX IF NOT EXISTS books_title_idx ON books (title);

-- Create index on author
CREATE INDEX IF NOT EXISTS books_author_idx ON books (author);

-- Create index on isbn
CREATE INDEX IF NOT EXISTS books_isbn_idx ON books (isbn);

-- Create index on created_at for pagination
CREATE INDEX IF NOT EXISTS books_created_at_idx ON books (created_at DESC);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraints
ALTER TABLE books
    ADD CONSTRAINT books_title_not_empty CHECK (length(trim(title)) > 0),
    ADD CONSTRAINT books_author_not_empty CHECK (length(trim(author)) > 0),
    ADD CONSTRAINT books_isbn_valid CHECK (length(replace(replace(isbn, '-', ''), ' ', '')) IN (10, 13)),
    ADD CONSTRAINT books_description_not_empty CHECK (length(trim(description)) > 0),
    ADD CONSTRAINT books_description_length CHECK (length(description) <= 1000),
    ADD CONSTRAINT books_purchase_link_length CHECK (purchase_link IS NULL OR length(purchase_link) <= 2000),
    ADD CONSTRAINT books_purchase_link_format CHECK (
        purchase_link IS NULL OR 
        purchase_link ~* '^https?://[^\s/$.?#].[^\s]*$'
    );

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

