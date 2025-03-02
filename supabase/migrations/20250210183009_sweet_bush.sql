/*
  # Initial Schema Setup for Government Schemes Application

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `full_name` (text)
      - `updated_at` (timestamp)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - category name
      - `slug` (text) - URL-friendly name
      - `description` (text)
      - `icon` (text) - Lucide icon name
    
    - `schemes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `eligibility` (text)
      - `benefits` (text)
      - `official_link` (text)
      - `category_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  full_name text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Create schemes table
CREATE TABLE schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  eligibility text,
  benefits text,
  official_link text,
  category_id uuid REFERENCES categories(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schemes are viewable by everyone"
  ON schemes FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Education', 'education', 'Educational schemes and scholarships', 'GraduationCap'),
  ('Agriculture', 'agriculture', 'Farming and agricultural initiatives', 'Sprout'),
  ('Health', 'health', 'Healthcare and medical schemes', 'Heart'),
  ('Business', 'business', 'Business and entrepreneurship programs', 'Building'),
  ('Housing', 'housing', 'Housing and real estate schemes', 'Home'),
  ('Employment', 'employment', 'Job and skill development programs', 'Briefcase');

-- Insert sample schemes
INSERT INTO schemes (title, description, eligibility, benefits, official_link, category_id) 
SELECT 
  'National Scholarship Portal',
  'A one-stop solution for all scholarship needs of students',
  'Students with family income less than 8 lakhs per annum',
  'Financial assistance for education expenses',
  'https://scholarships.gov.in',
  id
FROM categories WHERE slug = 'education';

INSERT INTO schemes (title, description, eligibility, benefits, official_link, category_id)
SELECT 
  'PM-KISAN',
  'Direct income support to farmers',
  'All land-holding farmers'' families',
  'Rs. 6000 per year as minimum income support',
  'https://pmkisan.gov.in',
  id
FROM categories WHERE slug = 'agriculture';