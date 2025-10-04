-- Add new columns to recipes table for external links, cooking time, and alert settings
ALTER TABLE public.recipes
ADD COLUMN external_url text,
ADD COLUMN total_cooking_time integer,
ADD COLUMN show_cooking_time boolean DEFAULT true,
ADD COLUMN alerts_enabled boolean DEFAULT false;

-- Add cooking_time column to ingredients table
ALTER TABLE public.ingredients
ADD COLUMN cooking_time integer DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN public.recipes.external_url IS 'External URL (YouTube or other) related to the recipe';
COMMENT ON COLUMN public.recipes.total_cooking_time IS 'Total cooking time in minutes';
COMMENT ON COLUMN public.recipes.show_cooking_time IS 'Toggle to show/hide cooking time display';
COMMENT ON COLUMN public.recipes.alerts_enabled IS 'Toggle to enable/disable cooking alerts';
COMMENT ON COLUMN public.ingredients.cooking_time IS 'Cooking time for this ingredient in minutes';