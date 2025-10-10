// Recipe Form - Create and edit recipes
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRecipes, Ingredient } from '@/contexts/RecipeContext';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';

const UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'pcs', 'slices', 'pinch', 'dash', 'cloves', 'sticks'];

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipe, addRecipe, updateRecipe } = useRecipes();
  
  const isEditing = !!id;
  const existingRecipe = isEditing ? getRecipe(id) : null;

  const [name, setName] = useState(existingRecipe?.name || '');
  const [description, setDescription] = useState(existingRecipe?.description || '');
  const [baseServings, setBaseServings] = useState(existingRecipe?.baseServings || 4);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    existingRecipe?.ingredients || [{ id: '1', name: '', quantity: 0, unit: 'g', cookingTime: 0 }]
  );
  const [instructions, setInstructions] = useState(existingRecipe?.instructions || '');
  const [externalUrl, setExternalUrl] = useState(existingRecipe?.externalUrl || '');
  const [showCookingTime, setShowCookingTime] = useState(existingRecipe?.showCookingTime ?? true);
  const [alertsEnabled, setAlertsEnabled] = useState(existingRecipe?.alertsEnabled ?? false);
  const [imageUrl, setImageUrl] = useState(existingRecipe?.imageUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Only JPG, PNG, and WEBP images are allowed');
        return;
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl || null;
    
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload images');
        return null;
      }

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, imageFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now().toString(), name: '', quantity: 0, unit: 'g', cookingTime: 0 }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(ing => (ing.id === id ? { ...ing, [field]: value } : ing)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a recipe name');
      return;
    }
    
    if (ingredients.some(ing => !ing.name.trim())) {
      toast.error('Please fill in all ingredient names');
      return;
    }

    const uploadedImageUrl = await uploadImage();
    if (imageFile && !uploadedImageUrl) {
      return; // Upload failed
    }

    const totalCookingTime = ingredients.reduce((sum, ing) => sum + (ing.cookingTime || 0), 0);

    const recipe = {
      name,
      description,
      baseServings,
      ingredients,
      instructions,
      externalUrl,
      totalCookingTime,
      showCookingTime,
      alertsEnabled,
      imageUrl: uploadedImageUrl || imageUrl,
    };

    if (isEditing) {
      updateRecipe(id, recipe);
      toast.success('Recipe updated successfully!');
    } else {
      addRecipe(recipe);
      toast.success('Recipe created successfully!');
    }
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-4xl px-4 py-8 md:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-primary hover:text-primary hover:scale-105 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recipes
        </Button>

        <h1 className="mb-8 text-3xl font-bold md:text-4xl">
          {isEditing ? 'Edit Recipe' : 'New Recipe'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Recipe Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Chocolate Chip Cookies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your recipe"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Base Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={baseServings}
                  onChange={(e) => setBaseServings(parseInt(e.target.value) || 1)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter the number of people this recipe serves as written
                </p>
              </div>

              <div className="space-y-2">
                <Label>Recipe Image</Label>
                <div className="space-y-4">
                  {imageUrl && (
                    <div className="relative w-full h-56 rounded-lg overflow-hidden border border-border">
                      <img 
                        src={imageUrl} 
                        alt="Recipe preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImageUrl('');
                          setImageFile(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="image"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-muted transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      {imageUrl ? 'Change Image' : 'Upload Image'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG, or WEBP (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalUrl">External Recipe Link (Optional)</Label>
                <Input
                  id="externalUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or any recipe URL"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Add a YouTube video or external recipe link
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ingredients</CardTitle>
              <Button type="button" size="sm" onClick={addIngredient}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 text-sm font-medium">
                <div>Ingredient</div>
                <div className="w-24 text-center">Quantity</div>
                <div className="w-28">Unit</div>
                <div className="w-32 text-center">Cook Time (min)</div>
                <div className="w-10"></div>
              </div>

              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2">
                  <Input
                    placeholder="e.g. All-purpose flour"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                    required
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-24"
                    value={ingredient.quantity || ''}
                    onChange={(e) => updateIngredient(ingredient.id, 'quantity', parseFloat(e.target.value) || 0)}
                    required
                  />
                  <Select
                    value={ingredient.unit}
                    onValueChange={(value) => updateIngredient(ingredient.id, 'unit', value)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="0"
                    className="w-32"
                    placeholder="0"
                    value={ingredient.cookingTime || ''}
                    onChange={(e) => updateIngredient(ingredient.id, 'cookingTime', parseInt(e.target.value) || 0)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(ingredient.id)}
                    disabled={ingredients.length === 1}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter cooking instructions, one step per line"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={8}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Write each step on a new line
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cooking Time & Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="showCookingTime" className="text-base">Show Cooking Time</Label>
                  <p className="text-sm text-muted-foreground">
                    Display total cooking time on recipe details
                  </p>
                </div>
                <Switch
                  id="showCookingTime"
                  checked={showCookingTime}
                  onCheckedChange={setShowCookingTime}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="alertsEnabled" className="text-base">Enable Cooking Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notifications when cooking time for ingredients ends
                  </p>
                </div>
                <Switch
                  id="alertsEnabled"
                  checked={alertsEnabled}
                  onCheckedChange={setAlertsEnabled}
                />
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">
                  Total Cooking Time: {ingredients.reduce((sum, ing) => sum + (ing.cookingTime || 0), 0)} minutes
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isUploading}>
              {isUploading ? 'Uploading...' : isEditing ? 'Update Recipe' : 'Save Recipe'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
