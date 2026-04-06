#!/bin/bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/home/ubuntu/backups/blog-db}"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/blog_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

docker exec blog-db pg_dump -U postgres -d blog | gzip > "$BACKUP_FILE"

find "$BACKUP_DIR" -name "blog_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo "[$(date)] Backup created: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
