ALTER TABLE productos
ADD COLUMN IF NOT EXISTS costo NUMERIC(12,2);

UPDATE productos
SET costo = precio
WHERE costo IS NULL;

ALTER TABLE productos
ALTER COLUMN costo SET NOT NULL;
