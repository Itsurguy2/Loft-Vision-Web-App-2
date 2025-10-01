-- LoftVision Database Schema
-- PostgreSQL Database

-- Drop table if exists
DROP TABLE IF EXISTS designs CASCADE;

-- Create designs table
CREATE TABLE designs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    style VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    square_feet INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(12, 2),
    architect VARCHAR(255),
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_designs_slug ON designs(slug);
CREATE INDEX idx_designs_style ON designs(style);

-- Add sample comment for documentation
COMMENT ON TABLE designs IS 'Loft interior and exterior design projects';
COMMENT ON COLUMN designs.slug IS 'URL-friendly identifier for the design';
COMMENT ON COLUMN designs.square_feet IS 'Total square footage of the loft';
COMMENT ON COLUMN designs.price IS 'Estimated project cost in USD';