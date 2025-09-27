-- Create DB schema and seed data
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  collection TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  image_url TEXT,
  attributes JSONB
);

TRUNCATE items RESTART IDENTITY;

INSERT INTO items (collection, slug, title, summary, description, image_url, attributes) VALUES
('projects','industrial-loft','Industrial Loft','20th-century industrial conversion','A warm industrial loft with exposed beams, custom built-in storage, and skylights.','https://picsum.photos/seed/industrial/800/600','{"area":"1200 sqft","beds":2,"baths":2,"budget":"$120k"}'),
('projects','minimalist-loft','Minimalist Loft','Bright and minimal','Clean white surfaces, natural wood, and flexible layout for small urban lofts.','https://picsum.photos/seed/minimal/800/600','{"area":"750 sqft","beds":1,"baths":1,"budget":"$80k"}'),
('projects','green-rooftop-loft','Green Rooftop Loft','Loft with rooftop garden','Integrated rooftop garden and passive ventilation for sustainable loft living.','https://picsum.photos/seed/green/800/600','{"area":"980 sqft","beds":2,"baths":1,"budget":"$95k"}'),
('bosses','crystalguardian','Crystal Guardian','An iconic conceptual loft design','Feature atrium, glass partitions, and a central crystal staircase.','https://picsum.photos/seed/crystal/800/600','{"artist":"Lead Architect","year":2025,"special":"glass staircase"}'),
('bosses','mantislords','Mantis Lords','Organic-curved loft','Curved timber ribs, integrated lighting, and custom joinery.','https://picsum.photos/seed/mantis/800/600','{"area":"1350 sqft","beds":3,"baths":2,"budget":"$160k"}');