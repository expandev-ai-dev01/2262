import { DiceConfigSelector } from '@/domain/diceConfig/components/DiceConfigSelector';

function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center space-y-8 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">GirarDado</h1>
        <p className="text-muted-foreground text-lg">Configure seu dado virtual</p>
      </div>
      <div className="w-full max-w-2xl px-4">
        <DiceConfigSelector />
      </div>
    </div>
  );
}

export { HomePage };
