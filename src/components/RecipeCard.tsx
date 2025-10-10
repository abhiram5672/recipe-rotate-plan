import { Users, Salad, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Recipe } from '@/contexts/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="h-56 bg-gradient-secondary relative overflow-hidden">
        {recipe.imageUrl ? (
          <>
            <img 
              src={recipe.imageUrl} 
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-overlay" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-foreground line-clamp-1 drop-shadow-sm">{recipe.name}</h3>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">{recipe.description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{recipe.baseServings} servings</span>
          </div>
          <div className="flex items-center gap-2">
            <Salad className="h-4 w-4 text-accent" />
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="default" className="w-full" asChild>
          <Link to={`/recipes/${recipe.id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
