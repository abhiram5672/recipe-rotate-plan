import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface CookingTimerProps {
  ingredientName: string;
  cookingTime: number;
  alertsEnabled: boolean;
}

export function CookingTimer({ ingredientName, cookingTime, alertsEnabled }: CookingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(cookingTime * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (alertsEnabled) {
            // Show notification
            toast.success(`${ingredientName} is ready!`, {
              duration: 5000,
            });
            
            // Try to show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Cooking Timer', {
                body: `${ingredientName} is ready!`,
                icon: '/favicon.ico',
              });
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, ingredientName, alertsEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(cookingTime * 60);
    }
    setIsRunning(true);
    
    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(cookingTime * 60);
  };

  return (
    <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2">
      <Clock className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium min-w-[60px]">{formatTime(timeLeft)}</span>
      <div className="flex gap-1">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={handleReset}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
