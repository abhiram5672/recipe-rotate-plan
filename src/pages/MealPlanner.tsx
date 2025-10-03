import { useState } from 'react';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '@/contexts/RecipeContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function MealPlanner() {
  const navigate = useNavigate();
  const { recipes, mealPlan, updateMealPlan, toggleRotation } = useRecipes();
  const [selectedCell, setSelectedCell] = useState<{ day: string; mealType: string } | null>(null);

  const handleCellClick = (day: string, mealType: string) => {
    setSelectedCell({ day, mealType });
  };

  const handleSelectRecipe = (recipeId: string) => {
    if (selectedCell) {
      updateMealPlan(selectedCell.day, selectedCell.mealType, recipeId);
      setSelectedCell(null);
    }
  };

  const handleToggleRotation = (day: string, mealType: string) => {
    toggleRotation(day, mealType);
  };

  const getRecipeName = (day: string, mealType: string) => {
    const meal = mealPlan[day]?.[mealType];
    if (!meal?.recipeId) return null;
    const recipe = recipes.find(r => r.id === meal.recipeId);
    return recipe?.name || null;
  };

  const isRotationEnabled = (day: string, mealType: string) => {
    return mealPlan[day]?.[mealType]?.rotate || false;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 md:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-primary hover:text-primary hover:scale-105 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recipes
        </Button>

        <div className="mb-8">
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold md:text-4xl">
            <div className="rounded-xl bg-gradient-cyber p-2 glow-effect">
              <CalendarDays className="h-8 w-8 text-white" />
            </div>
            <span className="bg-gradient-cyber bg-clip-text text-transparent">Weekly Meal Schedule</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Plan your meals for the week. Enable rotation to automatically cycle through recipes.
          </p>
        </div>

        <Card className="overflow-hidden border-primary/20">
          <div className="bg-gradient-cyber p-4 glow-effect">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <CalendarDays className="h-5 w-5" />
                <span className="hidden sm:inline">Weekly Meal Schedule</span>
                <span className="sm:hidden">Schedule</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
                {MEAL_TYPES.map(type => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span className="hidden sm:inline">{type}</span>
                    <span className="sm:hidden">{type.slice(0, 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20 bg-muted/50">
                  <th className="p-3 text-left font-semibold">Day</th>
                  {MEAL_TYPES.map(type => (
                    <th key={type} className="min-w-[200px] p-3 text-left font-semibold">
                      {type}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day} className="border-b border-primary/10 transition-colors hover:bg-primary/5">
                    <td className="p-3 font-medium">{day}</td>
                    {MEAL_TYPES.map(mealType => {
                      const recipeName = getRecipeName(day, mealType);
                      const hasRotation = isRotationEnabled(day, mealType);

                      return (
                        <td key={mealType} className="p-3">
                          <div className="space-y-2">
                            <button
                              onClick={() => handleCellClick(day, mealType)}
                              className="w-full rounded-xl border-2 border-dashed border-primary/30 bg-background/50 backdrop-blur-sm p-3 text-left text-sm transition-all hover:border-primary hover:bg-primary/5 hover:scale-105"
                            >
                              {recipeName || (
                                <span className="text-muted-foreground">Click to add meal</span>
                              )}
                            </button>
                            {recipeName && (
                              <div className="flex items-center gap-2 text-xs">
                                <Switch
                                  checked={hasRotation}
                                  onCheckedChange={() => handleToggleRotation(day, mealType)}
                                  className="scale-75"
                                />
                                <span className="text-muted-foreground">
                                  Rotate weekly
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent className="max-w-md border-primary/30">
          <DialogHeader>
            <DialogTitle>
              Select Recipe for {selectedCell?.day} - {selectedCell?.mealType}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] space-y-2 overflow-y-auto">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                if (selectedCell) {
                  updateMealPlan(selectedCell.day, selectedCell.mealType, null);
                  setSelectedCell(null);
                }
              }}
            >
              Clear meal
            </Button>
            {recipes.map(recipe => (
              <Button
                key={recipe.id}
                variant="outline"
                className="w-full justify-start hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all"
                onClick={() => handleSelectRecipe(recipe.id)}
              >
                {recipe.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
