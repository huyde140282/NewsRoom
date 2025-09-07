import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: 'page' | 'section' | 'inline';
}

export function ErrorMessage({ message, onRetry, variant = 'section' }: ErrorMessageProps) {
  if (variant === 'page') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="mx-auto text-destructive mb-4" size={48} />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-destructive mb-4" size={32} />
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-destructive">
      <AlertCircle size={16} />
      <span className="text-sm">{message}</span>
      {onRetry && (
        <Button onClick={onRetry} variant="ghost" size="sm">
          <RefreshCw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ 
  title = 'No data found', 
  description = 'There are no items to display at the moment.',
  icon
}: { 
  title?: string; 
  description?: string; 
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
