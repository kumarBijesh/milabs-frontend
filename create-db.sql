-- Create the milabs database if it doesn't exist
SELECT 'CREATE DATABASE milabs'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'milabs')\gexec
