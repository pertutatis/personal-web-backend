ALTER TABLE books
ADD COLUMN description TEXT NOT NULL DEFAULT '',
ADD COLUMN purchase_link TEXT;

-- Actualizar los libros existentes con una descripción por defecto
UPDATE books
SET description = 'No description available'
WHERE description = '';
