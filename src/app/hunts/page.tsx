import { HuntsList } from '@/components/hunts/hunts-list';

export default function HuntsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl">Hunts e Marks</h1>
        <p className="text-sm text-text-muted">Acompanhe o progresso das marcas disponíveis.</p>
      </div>
      <HuntsList />
    </div>
  );
}
