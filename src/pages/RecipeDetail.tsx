import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trash2, Edit } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRecipes } from '@/contexts/RecipeContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipe, deleteRecipe } = useRecipes();
  
  const recipe = id ? getRecipe(id) : null;
  const [servings, setServings] = useState(recipe?.baseServings || 4);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Recipe not found</h1>
            <Button onClick={() => navigate('/')}>Go back home</Button>
          </div>
        </div>
      </div>
    );
  }

  const scaleFactor = servings / recipe.baseServings;
  const scaledIngredients = recipe.ingredients.map(ing => ({
    ...ing,
    quantity: ing.quantity * scaleFactor,
  }));

  const handleDelete = () => {
    deleteRecipe(recipe.id);
    toast.success('Recipe deleted successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-4xl px-4 py-8 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/recipes/${recipe.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{recipe.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-6 h-64 rounded-lg bg-gradient-primary" />
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">{recipe.name}</h1>
          <p className="text-lg text-muted-foreground">{recipe.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ingredients</CardTitle>
                <div className="flex items-center gap-2 text-primary">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">{servings} servings</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="servings">Adjust servings:</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-2">
                {scaledIngredients.map(ing => (
                  <div key={ing.id} className="flex justify-between border-b pb-2">
                    <span>{ing.name}</span>
                    <span className="font-medium text-primary">
                      {ing.quantity.toFixed(2)} {ing.unit}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {recipe.instructions.split('\n').filter(step => step.trim()).map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
