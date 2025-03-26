ALTER TABLE articles
ADD COLUMN related_links JSONB DEFAULT '[]'::jsonb NOT NULL,
ADD COLUMN slug VARCHAR(100) NOT NULL,
ADD CONSTRAINT articles_slug_unique UNIQUE (slug);

-- Generar slugs para artículos existentes
UPDATE articles
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      -- Reemplazar caracteres especiales y espacios por guiones
      REGEXP_REPLACE(
        -- Eliminar acentos
        TRANSLATE(
          title,
          'áéíóúàèìòùãõñâêîôûäëïöüÿçÁÉÍÓÚÀÈÌÒÙÃÕÑÂÊÎÔÛÄËÏÖÜŸÇ',
          'aeiouaeiouaonaeiouaeiouyceaeioaeiouaonaeiouaeiouyc'
        ),
        '[^a-zA-Z0-9\s-]',
        '',
        'g'
      ),
      '\s+',
      '-',
      'g'
    ),
    '-+',
    '-',
    'g'
  )
);
