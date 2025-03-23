-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
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
    ADD CONSTRAINT books_isbn_valid CHECK (length(replace(replace(isbn, '-', ''), ' ', '')) IN (10, 13));
