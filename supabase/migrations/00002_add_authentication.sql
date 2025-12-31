/*
# Add Authentication Support

## 1. Enable Authentication

- Enable Row Level Security (RLS) on translations table
- Link translations to authenticated users
- Maintain backward compatibility with existing data

## 2. Security

- Users can only see their own translations
- Public users (not authenticated) are redirected to login

## 3. Notes

- Supabase Auth is already set up by default
- We just need to secure the translations table
*/

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read only their own translations
CREATE POLICY "Users can view their own translations"
  ON translations
  FOR SELECT
  USING (auth.uid()::uuid = user_uuid);

-- Allow authenticated users to insert their own translations
CREATE POLICY "Users can insert their own translations"
  ON translations
  FOR INSERT
  WITH CHECK (auth.uid()::uuid = user_uuid);

-- Allow authenticated users to delete their own translations
CREATE POLICY "Users can delete their own translations"
  ON translations
  FOR DELETE
  USING (auth.uid()::uuid = user_uuid);

-- Allow authenticated users to update their own translations
CREATE POLICY "Users can update their own translations"
  ON translations
  FOR UPDATE
  USING (auth.uid()::uuid = user_uuid);
