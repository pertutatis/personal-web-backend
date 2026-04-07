ALTER TABLE books ADD COLUMN image_url TEXT;

COMMENT ON COLUMN books.image_url IS 'URL path to the book cover image';
