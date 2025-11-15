import { InventoryClient } from '@/components/inventory/inventory-client';

export default function InventoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl">Inventário virtual</h1>
        <p className="text-sm text-text-muted">Marque quais itens já foram obtidos durante esta playthrough.</p>
      </div>
      <InventoryClient />
    </div>
  );
}
