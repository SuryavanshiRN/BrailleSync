/*
# Create translations table for Braille Translator

## 1. New Tables

- `translations`
  - `id` (uuid, primary key, default: gen_random_uuid())
  - `user_uuid` (uuid, not null) - Anonymous user identifier
  - `input_text` (text, not null) - Original input text
  - `braille_output` (text, not null) - Converted Braille text
  - `input_method` (text, not null) - Method used: 'text', 'image', 'audio', 'microphone'
  - `created_at` (timestamptz, default: now())

## 2. Security

- No RLS enabled - public access for all users
- All users can read and write their own translations based on user_uuid
- No authentication required (anonymous usage)

## 3. Indexes

- Index on user_uuid for faster queries
- Index on created_at for sorting

## 4. Notes

- This is a public application with anonymous usage
- Users are tracked by UUID stored in localStorage
- No sensitive data is stored
*/

CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uuid uuid NOT NULL,
  input_text text NOT NULL,
  braille_output text NOT NULL,
  input_method text NOT NULL CHECK (input_method IN ('text', 'image', 'audio', 'microphone')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_translations_user_uuid ON translations(user_uuid);
CREATE INDEX idx_translations_created_at ON translations(created_at DESC);