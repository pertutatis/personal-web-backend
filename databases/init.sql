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

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    isbn VARCHAR(13),
    purchase_link VARCHAR(2048),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS articles_title_idx ON articles (title);
CREATE INDEX IF NOT EXISTS articles_excerpt_idx ON articles (excerpt);
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles (slug);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles (created_at DESC);
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
CREATE INDEX IF NOT EXISTS books_isbn_idx ON books (isbn);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE articles IS 'Stores blog articles and their content';
COMMENT ON TABLE users IS 'Stores user authentication information';
COMMENT ON TABLE books IS 'Stores book information that can be referenced in articles';

COMMENT ON COLUMN articles.excerpt IS 'A brief summary or preview of the article content';
COMMENT ON COLUMN articles.related_links IS 'Array of related links with text and URL';
COMMENT ON COLUMN articles.slug IS 'URL-friendly version of the title';
COMMENT ON COLUMN users.email IS 'User email address used for authentication';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hash of the user password';
COMMENT ON COLUMN books.isbn IS 'International Standard Book Number';
COMMENT ON COLUMN books.purchase_link IS 'URL where the book can be purchased';
