import { Smartphone, Code2, Database, LayoutDashboard, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import type { ServiceItem } from '../types';

interface ServicesProps {
  onSelectServiceForQuote: (serviceId: string) => void;
}

export const Services = ({ onSelectServiceForQuote }: ServicesProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone size={26} />;
      case 'Code2': return <Code2 size={26} />;
      case 'Database': return <Database size={26} />;
      case 'LayoutDashboard': return <LayoutDashboard size={26} />;
      default: return <Code2 size={26} />;
    }
  };

  return (
    <section id="servicios" className="section-padding relative">
      <div className="container-lpb">
        {/* Section Header with Scroll Reveal */}
        <div className="section-header reveal-on-scroll">
          <div className="subtitle">Arsenal de Soluciones</div>
          <h2 className="title">
            Ingeniería de Software de <span className="text-gold-gradient">Vanguardia</span>
          </h2>
          <p className="description">
            Cada solución está forjada con arquitectura robusta, código limpio en TypeScript y optimizaciones de rendimiento extremo.
          </p>
        </div>

        {/* Services Grid with Staggered Reveal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {SERVICES_DATA.map((service: ServiceItem, index: number) => (
            <div
              key={service.id}
              className={`glass-card-interactive flex flex-col justify-between reveal-on-scroll reveal-stagger-${(index % 4) + 1}`}
            >
              <div>
                {/* Header Icon + Badge */}
                <div className="flex justify-between items-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 shadow-sm">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-['JetBrains_Mono'] text-slate-500 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg">
                    MOD-0{service.id === 'pwa' ? '1' : service.id === 'custom-web' ? '2' : service.id === 'database-cloud' ? '3' : '4'}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {service.title}
                </h3>

                <div className="text-sm text-amber-700 font-semibold mb-4">
                  {service.subtitle}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Highlights List */}
                <div className="flex flex-col gap-2.5 mb-6">
                  {service.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech Tags */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-6 pt-4 border-t border-slate-200/70">
                  {service.techTags.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 bg-slate-200/70 border border-slate-300/60 rounded-md text-slate-700 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA Action */}
                <button
                  onClick={() => onSelectServiceForQuote(service.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white hover:bg-amber-600 font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Cotizar este Servicio</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
