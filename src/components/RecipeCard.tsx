import { Users, Salad } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Recipe } from '@/contexts/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 border-primary/20 hover:border-primary/50">
      <div className="h-48 bg-gradient-cyber relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{recipe.name}</CardTitle>
        <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-primary" />
            <span>Serves {recipe.baseServings}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Salad className="h-4 w-4 text-accent" />
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-gradient-cyber hover:text-white hover:border-primary transition-all" asChild>
          <Link to={`/recipes/${recipe.id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
