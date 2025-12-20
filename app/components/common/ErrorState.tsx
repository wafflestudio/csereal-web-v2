import type { ReactNode } from 'react';
import Button from './Button';

interface ErrorAction {
  label: string;
  onClick: () => void;
}

interface ErrorStateProps {
  title?: ReactNode;
  message: ReactNode;
  action: ErrorAction;
}

export default function ErrorState({
  title,
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="grow p-15 flex flex-col items-start gap-4">
      {title && <p className="text-lg text-white">{title}</p>}
      <p className="text-lg text-white">{message}</p>
      <Button
        variant="outline"
        tone="neutral"
        size="md"
        onClick={action.onClick}
      >
        {action.label}
      </Button>
    </div>
  );
}
