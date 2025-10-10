-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-images',
  'recipe-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Allow authenticated users to upload their own recipe images
CREATE POLICY "Users can upload recipe images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'recipe-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own recipe images
CREATE POLICY "Users can update their own recipe images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'recipe-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own recipe images
CREATE POLICY "Users can delete their own recipe images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'recipe-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view recipe images (public bucket)
CREATE POLICY "Anyone can view recipe images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'recipe-images');

-- Add image_url column to recipes table
ALTER TABLE recipes
ADD COLUMN image_url TEXT;