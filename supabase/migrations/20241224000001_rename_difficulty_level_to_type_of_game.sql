-- Rename difficulty_level column to type_of_game in competitions table
ALTER TABLE public.competitions 
RENAME COLUMN difficulty_level TO type_of_game;

-- Update the check constraint to reflect the new column name and values
ALTER TABLE public.competitions 
DROP CONSTRAINT IF EXISTS competitions_difficulty_level_check;

ALTER TABLE public.competitions 
ADD CONSTRAINT competitions_type_of_game_check 
CHECK (type_of_game IN ('Game of Luck', 'Game of Skill'));

-- Add new columns for improved import URL functionality
ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS permit_number text,
ADD COLUMN IF NOT EXISTS draw_date timestamp with time zone;

-- Update existing data to use new type_of_game values
UPDATE public.competitions 
SET type_of_game = CASE 
    WHEN type_of_game = 'Beginner' THEN 'Game of Luck'
    WHEN type_of_game = 'Intermediate' THEN 'Game of Skill'
    WHEN type_of_game = 'Advanced' THEN 'Game of Skill'
    WHEN type_of_game = 'All Levels' THEN 'Game of Luck'
    ELSE type_of_game
END
WHERE type_of_game IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels');