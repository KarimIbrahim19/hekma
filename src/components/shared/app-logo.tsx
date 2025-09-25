import { Pill } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center justify-center gap-2 text-primary font-headline font-bold text-lg">
      <Pill className="h-6 w-6" />
      <span className="group-data-[collapsible=icon]:hidden">PharmaLink</span>
    </div>
  );
}
