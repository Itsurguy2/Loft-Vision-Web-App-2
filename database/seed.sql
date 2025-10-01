-- LoftVision Seed Data
-- Insert 5+ unique loft designs with multiple attributes

INSERT INTO designs (title, slug, description, style, location, square_feet, bedrooms, bathrooms, year, price, architect, image_url) VALUES

('Industrial Brooklyn Loft', 'industrial-brooklyn-loft', 
'A stunning industrial loft featuring exposed brick walls, high ceilings with steel beams, and large factory windows. The open-concept design seamlessly blends raw industrial elements with modern comfort, creating a unique urban living space perfect for creative professionals.', 
'Industrial', 'Brooklyn, New York', 2400, 2, 2, 2023, 850000.00, 'Sarah Mitchell',
'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'),

('Minimalist Scandinavian Loft', 'minimalist-scandinavian-loft',
'Clean lines and natural materials define this serene Scandinavian-inspired loft. White oak flooring, abundant natural light, and a neutral color palette create a calming atmosphere. Features include custom built-in storage and energy-efficient skylights throughout.',
'Scandinavian', 'Portland, Oregon', 1800, 1, 1, 2024, 625000.00, 'Erik Johansen',
'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'),

('Contemporary Urban Penthouse', 'contemporary-urban-penthouse',
'This luxurious penthouse loft offers breathtaking city views through floor-to-ceiling windows. Modern finishes include Italian marble countertops, smart home integration, and a private rooftop terrace with outdoor kitchen. The ultimate in sophisticated urban living.',
'Contemporary', 'Chicago, Illinois', 3200, 3, 3, 2023, 1250000.00, 'David Chen',
'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'),

('Rustic Converted Barn Loft', 'rustic-converted-barn-loft',
'Experience country charm meets modern luxury in this beautifully converted barn loft. Original timber beams, stone fireplace, and reclaimed wood details preserve the building heritage while offering all contemporary amenities. Features a spacious mezzanine office area.',
'Rustic', 'Austin, Texas', 2800, 2, 2, 2022, 725000.00, 'Rebecca Stone',
'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop'),

('Modern Glass Box Loft', 'modern-glass-box-loft',
'An architectural masterpiece featuring walls of glass that blur the boundaries between indoor and outdoor spaces. Polished concrete floors, minimalist fixtures, and an innovative open staircase create a gallery-like atmosphere. Perfect for art collectors and design enthusiasts.',
'Modern', 'Los Angeles, California', 2600, 2, 2, 2024, 975000.00, 'James Park',
'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop'),

('Victorian Warehouse Conversion', 'victorian-warehouse-conversion',
'Historic Victorian warehouse transformed into an elegant loft space. Features original cast-iron columns, restored brick archways, and stunning barrel-vaulted ceilings. Modern amenities blend seamlessly with 19th-century architectural details creating timeless sophistication.',
'Victorian', 'Boston, Massachusetts', 3400, 3, 2, 2023, 1100000.00, 'Margaret Wilson',
'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop'),

('Japanese-Inspired Zen Loft', 'japanese-inspired-zen-loft',
'Find tranquility in this zen-inspired loft featuring shoji screen partitions, tatami-style flooring in the meditation room, and a minimalist Japanese soaking tub. Natural materials like bamboo and stone create a peaceful retreat from city life. Includes a private zen garden terrace.',
'Japanese', 'Seattle, Washington', 2000, 2, 2, 2024, 780000.00, 'Kenji Yamamoto',
'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&h=600&fit=crop');

-- Verify data insertion
SELECT COUNT(*) as total_designs FROM designs;