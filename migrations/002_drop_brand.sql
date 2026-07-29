-- Brand is always "Sharepoint"; drop the unused per-document column
ALTER TABLE documents DROP COLUMN brand;
