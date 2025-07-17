-- Update competition categories to new values
UPDATE public.competition_categories SET 
    name = 'Open (free)',
    description = 'Free and open competitions accessible to everyone'
WHERE name = 'Design & Art';

UPDATE public.competition_categories SET 
    name = 'Barrier (low)',
    description = 'Competitions with minimal entry requirements or fees'
WHERE name = 'Photography';

UPDATE public.competition_categories SET 
    name = 'Barrier (Medium)',
    description = 'Competitions with moderate entry requirements or fees'
WHERE name = 'Writing';

UPDATE public.competition_categories SET 
    name = 'Exclusive',
    description = 'Premium competitions with high entry requirements'
WHERE name = 'Video & Film';

-- Remove unused categories
DELETE FROM public.competition_categories WHERE name IN ('Music & Audio', 'Innovation', 'Gaming', 'Business');

-- Update existing competitions to use new category names
UPDATE public.competitions SET category = 'Open (free)' WHERE category = 'Design & Art';
UPDATE public.competitions SET category = 'Barrier (low)' WHERE category = 'Photography';
UPDATE public.competitions SET category = 'Barrier (Medium)' WHERE category = 'Writing';
UPDATE public.competitions SET category = 'Exclusive' WHERE category = 'Video & Film';
UPDATE public.competitions SET category = 'Open (free)' WHERE category IN ('Music & Audio', 'Innovation', 'Gaming', 'Business');
