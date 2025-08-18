-- Migration: Create categories table
-- Created: 2024-01-01
-- Description: Create product categories table with hierarchical structure

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Vitamins', 'vitamins', 'Essential vitamins for optimal health', true, 1),
('Minerals', 'minerals', 'Important minerals and trace elements', true, 2),
('Herbal', 'herbal', 'Natural herbal supplements', true, 3),
('Sports Nutrition', 'sports-nutrition', 'Performance and recovery supplements', true, 4),
('Protein', 'protein', 'Protein powders and supplements', true, 5),
('Amino Acids', 'amino-acids', 'Essential and non-essential amino acids', true, 6),
('Omega Fatty Acids', 'omega-fatty-acids', 'Omega-3, 6, and 9 fatty acids', true, 7),
('Probiotics', 'probiotics', 'Beneficial bacteria for digestive health', true, 8);