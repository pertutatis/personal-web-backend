-- Add index to optimize text-based ID lookups
CREATE INDEX IF NOT EXISTS books_id_text_idx ON books ((id::text));

COMMENT ON INDEX books_id_text_idx IS 'Index for optimizing lookups when comparing book IDs as text';
