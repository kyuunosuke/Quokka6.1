-- First, remove the existing constraint if it exists
ALTER TABLE competitions 
DROP CONSTRAINT IF EXISTS competitions_difficulty_level_check;

-- Update ALL existing records to use the new game type values
-- Handle all possible existing values comprehensively
UPDATE competitions 
SET difficulty_level = CASE 
  WHEN difficulty_level IN ('Beginner', 'Easy', 'Novice', 'Starter') THEN 'Game of Skill'
  WHEN difficulty_level IN ('Intermediate', 'Medium', 'Moderate') THEN 'Game of Skill'
  WHEN difficulty_level IN ('Advanced', 'Hard', 'Expert', 'Professional') THEN 'Game of Skill'
  WHEN difficulty_level IN ('All Levels', 'Any Level', 'Mixed') THEN 'Game of Skill'
  WHEN difficulty_level IN ('Luck', 'Random', 'Chance', 'Lottery') THEN 'Game of Luck'
  WHEN difficulty_level = 'Game of Luck' THEN 'Game of Luck'
  WHEN difficulty_level = 'Game of Skill' THEN 'Game of Skill'
  WHEN difficulty_level IS NULL OR difficulty_level = '' THEN 'Game of Skill'
  ELSE 'Game of Skill'
END;

-- Set a default value for the column
ALTER TABLE competitions 
ALTER COLUMN difficulty_level SET DEFAULT 'Game of Skill';

-- Now add the check constraint to ensure only valid game types are allowed
ALTER TABLE competitions 
ADD CONSTRAINT competitions_difficulty_level_check 
CHECK (difficulty_level IN ('Game of Luck', 'Game of Skill'));

-- Final cleanup: ensure any remaining NULL or invalid values are set to default
UPDATE competitions 
SET difficulty_level = 'Game of Skill'
WHERE difficulty_level IS NULL 
   OR difficulty_level NOT IN ('Game of Luck', 'Game of Skill');
