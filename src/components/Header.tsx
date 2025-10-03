import { ChefHat } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <ChefHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">MyRecipe.in</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/meal-planner">
              <span className="hidden sm:inline">Meal Planner</span>
              <span className="sm:hidden">Planner</span>
            </Link>
          </Button>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to="/recipes/new">
              <span className="hidden sm:inline">+ New Recipe</span>
              <span className="sm:hidden">+ Recipe</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
