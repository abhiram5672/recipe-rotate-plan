import { useState } from 'react';
import { ChefHat, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { RecipeCard } from '@/components/RecipeCard';
import { useRecipes } from '@/contexts/RecipeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-cyber glow-effect"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <ChefHat className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h1 
            className="mb-4 bg-gradient-cyber bg-clip-text text-4xl font-bold text-transparent glow-text md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Discover Delicious Recipes
          </motion.h1>
          <motion.p 
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Create, store, and scale your favorite recipes. Plan your weekly meals with ease.
          </motion.p>
        </motion.div>

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
          <motion.div 
            className="py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-lg text-muted-foreground">No recipes found. Create your first recipe!</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
