import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projectsData';
import type { ProjectItem } from '../types';

export const ProjectVault = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pwa' | 'web' | 'dashboard' | 'database'>('all');

  const filteredProjects = activeFilter === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'pwa', label: 'PWAs' },
    { id: 'dashboard', label: 'Dashboards' },
    { id: 'web', label: 'Web a Medida' },
    { id: 'database', label: 'Cloud' }
  ];

  return (
    <section id="vault" className="section-padding relative">
      <div className="container-lpb">
        <div className="section-header reveal-on-scroll mb-8">
          <div className="subtitle">Portafolio & Trabajos</div>
          <h2 className="title">
            Proyectos <span className="text-gold-gradient">Destacados</span>
          </h2>
          <p className="description">
            Explora algunas de nuestras soluciones desarrolladas con diseño a medida y código de alto rendimiento.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center gap-2 flex-wrap mb-10 reveal-on-scroll">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${activeFilter === f.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white/80 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Compact Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredProjects.map((project: ProjectItem) => (
            <div
              key={project.id}
              className="glass-card-interactive p-4 sm:p-5 flex flex-col justify-between project-card-enter group"
            >
              <div>
                {/* Thumbnail Preview */}
                <div className="relative w-full h-30 rounded-xl overflow-hidden mb-4 bg-slate-100 border border-slate-200/80">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-fit transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-amber-400 px-2.5 py-1 rounded-md border border-slate-700/60 shadow-sm">
                    {project.categoryLabel}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-amber-700 transition-colors">
                  {project.title}
                </h3>

                {/* Short Description */}
                <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-4">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1 mb-4 pt-3 border-t border-slate-200/60">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 bg-slate-100/90 border border-slate-200 rounded text-slate-600 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <a
                  href={project.projectUrl || '#contacto'}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-amber-600 text-white font-medium text-xs transition-colors duration-200 shadow-xs cursor-pointer no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Ver Detalles</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectVault;
