import { useState } from 'react';
import { ChefHat, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { RecipeCard } from '@/components/RecipeCard';
import { useRecipes } from '@/contexts/RecipeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { recipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-12 md:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-cyber glow-effect">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-4 bg-gradient-cyber bg-clip-text text-4xl font-bold text-transparent glow-text md:text-5xl">
            Discover Delicious Recipes
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Create, store, and scale your favorite recipes. Plan your weekly meals with ease.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="mx-auto mb-12 flex max-w-3xl flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/30 focus:border-primary"
            />
          </div>
          <Button className="bg-gradient-cyber hover:opacity-90 hover:scale-105 glow-effect" asChild>
            <Link to="/recipes/new">+ Create Recipe</Link>
          </Button>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">No recipes found. Create your first recipe!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
