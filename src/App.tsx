import { useGameStore } from './lib/store';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { GuideView } from './components/GuideView';
import { InventoryView } from './components/InventoryView';
import { ProgressView } from './components/ProgressView';

export default function App() {
  const activeView = useGameStore(state => state.activeView);

  return (
    <div className="min-h-screen bg-slate-950 dark">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'guide' && <GuideView />}
        {activeView === 'inventory' && <InventoryView />}
        {activeView === 'progress' && <ProgressView />}
      </main>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}