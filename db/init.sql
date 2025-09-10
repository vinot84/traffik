-- Create schemas for multi-tenant architecture
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS driver;
CREATE SCHEMA IF NOT EXISTS citation;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set search path to include all schemas
ALTER DATABASE citations SET search_path = auth, driver, citation, public;