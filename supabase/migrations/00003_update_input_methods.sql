/*
# Update input_method constraint

## Changes

- Add 'file' and 'braille' to allowed input_method values
- This allows saving translations from file uploads and braille-to-text conversions

## Notes

- 'file' is used when users upload PDF/TXT files
- 'braille' is used in reverse mode (Braille → Text)
*/

-- Drop the old constraint
ALTER TABLE translations 
DROP CONSTRAINT IF EXISTS translations_input_method_check;

-- Add new constraint with all supported methods
ALTER TABLE translations 
ADD CONSTRAINT translations_input_method_check 
CHECK (input_method IN ('text', 'image', 'audio', 'microphone', 'file', 'braille'));
