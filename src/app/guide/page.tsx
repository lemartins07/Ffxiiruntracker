import { GuideList } from '@/components/guide/guide-list';

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl">Todas as seções</h1>
        <p className="text-sm text-text-muted">Filtre por tipo e encontre rapidamente a próxima etapa.</p>
      </div>
      <GuideList />
    </div>
  );
}
