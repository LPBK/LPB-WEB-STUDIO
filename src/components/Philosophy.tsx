import { Cpu, Lock, Compass } from 'lucide-react';

export const Philosophy = () => {
  const pillars = [
    {
      icon: <Cpu size={26} />,
      title: 'Una idea una aplicacion',
      desc: 'Tu visión del papel a una experiencia digital transformamos conceptos complejos en plataformas funcionales, optimizadas y listas para escalar desde el primer día.'
    },
    {
      icon: <Compass size={26} />,
      title: 'Desarrollo Artesanal y Escalable',
      desc: 'No usamos plantillas genéricas. Cada proyecto se diseña y programa a medida para reflejar autoridad y distinción de marca.'
    },
    {
      icon: <Lock size={26} />,
      title: 'Seguridad & Control de Roles (RBAC)',
      desc: 'Protección integral de datos con políticas de seguridad a nivel de filas (RLS), encriptación end-to-end y aislamiento estricto de privilegios administrativos.'
    }
  ];

  return (
    <section id="filosofia" className="section-padding relative">
      <div className="container-lpb">
        <div className="section-header reveal-on-scroll">
          <div className="subtitle">El Escudo de Calidad</div>
          <h2 className="title">
            Nuestros Estándares de <span className="text-gold-gradient">Ingeniería</span>
          </h2>
          <p className="description">
            En LPB WEB Studio no solo escribimos código: forjamos plataformas duraderas y de alta fidelidad.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}
        >
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className={`glass-card-interactive p-8 reveal-on-scroll reveal-stagger-${idx + 1}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 mb-5 shadow-sm">
                {pillar.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {pillar.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
