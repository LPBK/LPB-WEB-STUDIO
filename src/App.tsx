import { useState, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { ProjectVault } from './components/ProjectVault';
import { Philosophy } from './components/Philosophy';
import { CommentsSection } from './components/CommentsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { useScrollAnimation } from './hooks/useScrollAnimation';

// Lazy load only the heavy estimator modal on demand
const EstimatorModal = lazy(() => import('./components/EstimatorModal'));
const AdminModal = lazy(() => import('./components/AdminModal'));

export function App() {
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string | undefined>(undefined);

  // Initialize and run dynamic scroll animations
  useScrollAnimation();

  const handleOpenEstimator = (serviceId?: string) => {
    setSelectedServiceForQuote(serviceId);
    setIsEstimatorOpen(true);
  };

  const handleCloseEstimator = () => {
    setIsEstimatorOpen(false);
    setSelectedServiceForQuote(undefined);
  };

  return (
    <div className="lpb-app-root">
      {/* Navigation */}
      <Navbar onOpenEstimator={() => handleOpenEstimator()} />

      {/* Main Content Flow */}
      <main>
        <Hero onOpenEstimator={() => handleOpenEstimator()} />
        <Services onSelectServiceForQuote={(serviceId) => handleOpenEstimator(serviceId)} />
        <InteractiveTerminal onOpenEstimator={() => handleOpenEstimator()} />
        <ProjectVault />
        <Philosophy />
        <CommentsSection />
        <ContactSection />
      </main>

      {/* Footer with Secret Admin Trigger */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Interactive Estimator Modal - Lazy Loaded On Demand */}
      {isEstimatorOpen && (
        <Suspense fallback={null}>
          <EstimatorModal
            isOpen={isEstimatorOpen}
            onClose={handleCloseEstimator}
            initialServiceId={selectedServiceForQuote}
          />
        </Suspense>
      )}

      {/* Secret Admin & Neon Moderation Panel */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
