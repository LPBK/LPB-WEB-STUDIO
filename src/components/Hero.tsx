import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenEstimator: () => void;
}

export const Hero = ({ onOpenEstimator }: HeroProps) => {
  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] pt-32 pb-16 flex items-center overflow-hidden"
    >
      {/* Dynamic Background Light Rings */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(59, 130, 246, 0.06) 45%, transparent 70%)',
          filter: 'blur(70px)'
        }}
      />

      <div className="container-lpb relative z-10">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3.5rem',
            alignItems: 'center'
          }}
          className="hero-grid"
        >
          {/* Left Column: Brand Statement & Actions */}
          <div>
            {/* Main Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-extrabold mb-6 tracking-tight text-slate-900"
            >
              ARQUITECTURA DE <br />
              <span className="text-gold-gradient">SOFTWARE DE ÉLITE</span> <br />
              <span className="text-silver-gradient">& PWAs ROBUSTAS</span>
            </h1>

            {/* Bio Paragraph */}
            <p
              className="text-lg text-slate-600 leading-relaxed mb-8 max-w-155"
            >
              Especialistas en desarrollo web moderno, aplicaciones web progresivas (<strong>PWA</strong>) y soluciones digitales integrales.
              Transformamos ideas en plataformas escalables, rápidas y optimizadas con integración de bases de datos y arquitectura robusta.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={onOpenEstimator}
                className="btn-gold"
                id="hero-estimator-btn"
                style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}
              >
                <Sparkles size={18} />
                <span>Cotizar Proyecto en Vivo</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: Floating 3D Crest Insignia */}
          <div className="flex justify-center items-center relative -bottom-6">
            <div
              className="float-animation relative w-full max-w-105 aspect-square flex items-center justify-center"
            >
              {/* Glowing Aura Ring */}
              <div
                className="absolute -inset-6 rounded-full pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)',
                  filter: 'blur(35px)'
                }}
              />

              {/* Insignia Card Frame */}
              <div
                className="relative w-full h-full rounded-full p-0 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
              >
                <img
                  src="/assets/LPBlogo.png"
                  alt="LPB WEB Studio"
                  className="w-full h-full rounded-full object-cover block drop-shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/lpb_crest.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Realtime Metrics Strip in Light Glassmorphism */}
        <div
          className="mt-16 p-8 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center bg-white/75 backdrop-blur-xl border border-slate-200/80 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.06)] reveal-on-scroll"
        >
          <div>
            <div className="font-['Cinzel'] text-4xl font-extrabold text-amber-600 mb-1">
              0.5s
            </div>
            <div className="text-sm font-bold text-slate-800">
              Carga Ultrarrápida
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Optimización TTFB y Core Web Vitals
            </div>
          </div>

          <div>
            <div className="font-['Cinzel'] text-4xl font-extrabold text-blue-600 mb-1">
              100%
            </div>
            <div className="text-sm font-bold text-slate-800">
              Disponibilidad PWA
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Experiencia Nativa Offline y Móvil
            </div>
          </div>

          <div>
            <div className="font-['Cinzel'] text-4xl font-extrabold text-emerald-600 mb-1">
              24/7
            </div>
            <div className="text-sm font-bold text-slate-800">
              Arquitectura Escalable
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Backend Robusto & Supabase Cloud
            </div>
          </div>

          <div>
            <div className="font-['Cinzel'] text-4xl font-extrabold text-slate-900 mb-1">
              100%
            </div>
            <div className="text-sm font-bold text-slate-800">
              Código Tipado
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Seguridad, Rendimiento y Cero Bugs
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-grid p {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-grid button, .hero-grid a {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
