import { createContext, useContext, useState, ReactNode } from 'react';

// Recipe ingredient with optional cooking time
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cookingTime?: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  baseServings: number;
  ingredients: Ingredient[];
  instructions: string;
  externalUrl?: string;
  totalCookingTime?: number;
  showCookingTime?: boolean;
  alertsEnabled?: boolean;
}

export interface MealPlan {
  [day: string]: {
    [mealType: string]: {
      recipeId: string | null;
      rotate: boolean;
    };
  };
}

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, recipe: Omit<Recipe, 'id'>) => void;
  deleteRecipe: (id: string) => void;
  getRecipe: (id: string) => Recipe | undefined;
  mealPlan: MealPlan;
  updateMealPlan: (day: string, mealType: string, recipeId: string | null, rotate?: boolean) => void;
  toggleRotation: (day: string, mealType: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const initialMealPlan: MealPlan = DAYS.reduce((acc, day) => {
  acc[day] = MEAL_TYPES.reduce((meals, type) => {
    meals[type] = { recipeId: null, rotate: false };
    return meals;
  }, {} as any);
  return acc;
}, {} as MealPlan);

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
    baseServings: 4,
    ingredients: [
      { id: '1', name: 'Spaghetti', quantity: 400, unit: 'g' },
      { id: '2', name: 'Eggs', quantity: 4, unit: 'pcs' },
      { id: '3', name: 'Pancetta', quantity: 200, unit: 'g' },
      { id: '4', name: 'Parmesan cheese', quantity: 100, unit: 'g' },
      { id: '5', name: 'Black pepper', quantity: 2, unit: 'tsp' },
    ],
    instructions: 'Cook spaghetti according to package directions.\nFry pancetta until crispy.\nMix eggs and cheese.\nCombine hot pasta with pancetta.\nAdd egg mixture off heat, stirring quickly.\nSeason with black pepper and serve.',
  },
  {
    id: '2',
    name: 'Chocolate Chip Cookies',
    description: 'Classic homemade chocolate chip cookies that are soft and chewy inside with crispy edges.',
    baseServings: 24,
    ingredients: [
      { id: '1', name: 'All-purpose flour', quantity: 280, unit: 'g' },
      { id: '2', name: 'Butter', quantity: 226, unit: 'g' },
      { id: '3', name: 'Brown sugar', quantity: 200, unit: 'g' },
      { id: '4', name: 'Eggs', quantity: 2, unit: 'pcs' },
      { id: '5', name: 'Vanilla extract', quantity: 2, unit: 'tsp' },
      { id: '6', name: 'Baking soda', quantity: 1, unit: 'tsp' },
      { id: '7', name: 'Salt', quantity: 1, unit: 'tsp' },
      { id: '8', name: 'Chocolate chips', quantity: 340, unit: 'g' },
    ],
    instructions: 'Preheat oven to 375°F (190°C).\nCream butter and sugars together.\nBeat in eggs and vanilla.\nMix in flour, baking soda, and salt.\nFold in chocolate chips.\nDrop spoonfuls onto baking sheet.\nBake for 9-11 minutes until golden.\nCool on wire rack.',
  },
];

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [mealPlan, setMealPlan] = useState<MealPlan>(initialMealPlan);

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
    };
    setRecipes([...recipes, newRecipe]);
  };

  const updateRecipe = (id: string, recipe: Omit<Recipe, 'id'>) => {
    setRecipes(recipes.map(r => (r.id === id ? { ...recipe, id } : r)));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const getRecipe = (id: string) => {
    return recipes.find(r => r.id === id);
  };

  const updateMealPlan = (day: string, mealType: string, recipeId: string | null, rotate = false) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: { recipeId, rotate },
      },
    }));
  };

  const toggleRotation = (day: string, mealType: string) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: {
          ...prev[day][mealType],
          rotate: !prev[day][mealType].rotate,
        },
      },
    }));
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipe,
        mealPlan,
        updateMealPlan,
        toggleRotation,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within RecipeProvider');
  }
  return context;
}
