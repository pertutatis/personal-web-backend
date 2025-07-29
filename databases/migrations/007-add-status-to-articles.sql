-- Migration 007: Add status column to articles table for draft/published functionality
-- Date: 2024-12-19
-- Description: Adds status column with DRAFT/PUBLISHED states and proper constraints

-- Add status column with default DRAFT value
ALTER TABLE articles 
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'DRAFT';

-- Add check constraint to ensure only valid status values
ALTER TABLE articles 
ADD CONSTRAINT articles_status_check 
CHECK (status IN ('DRAFT', 'PUBLISHED'));

-- Create index on status column for efficient filtering
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles (status);

-- Create composite index for status + created_at for pagination queries
CREATE INDEX IF NOT EXISTS articles_status_created_at_idx ON articles (status, created_at DESC);

-- Update existing articles to PUBLISHED status to maintain current behavior
-- (All existing articles should remain visible in the blog)
UPDATE articles 
SET status = 'PUBLISHED' 
WHERE status = 'DRAFT';

-- Add comment to document the status column
COMMENT ON COLUMN articles.status IS 'Article status: DRAFT (work in progress) or PUBLISHED (visible to public)';

-- Add comment about the migration
COMMENT ON TABLE articles IS 'Articles table - Updated with status column for draft/published functionality';

-- Verify the migration
DO $$
BEGIN
    -- Check if status column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'status'
    ) THEN
        RAISE EXCEPTION 'Migration failed: status column not found';
    END IF;
    
    -- Check if constraint exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'articles_status_check'
    ) THEN
        RAISE EXCEPTION 'Migration failed: status check constraint not found';
    END IF;
    
    -- Check if index exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'articles' AND indexname = 'articles_status_idx'
    ) THEN
        RAISE EXCEPTION 'Migration failed: status index not found';
    END IF;
    
    RAISE NOTICE 'Migration 007 completed successfully';
END $$; 