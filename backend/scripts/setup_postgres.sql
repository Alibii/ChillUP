-- One-time bootstrap: creates a dedicated role + database for the ChillUP backend.
-- Runs under trust auth (temporarily enabled by setup_postgres.ps1), so no
-- postgres superuser password is required or changed.
--
-- Expects a `chillup_password` psql variable (passed via `-v`) - see
-- setup_postgres.ps1, which generates a random one at runtime. Nothing
-- sensitive is hardcoded here so this file is safe to commit/publish.

DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'chillup_app') THEN
      CREATE ROLE chillup_app LOGIN PASSWORD :'chillup_password';
   ELSE
      ALTER ROLE chillup_app WITH PASSWORD :'chillup_password';
   END IF;
END
$$;

ALTER ROLE chillup_app CREATEDB;

SELECT 'CREATE DATABASE chillup OWNER chillup_app ENCODING ''UTF8'''
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'chillup')\gexec

GRANT ALL PRIVILEGES ON DATABASE chillup TO chillup_app;
