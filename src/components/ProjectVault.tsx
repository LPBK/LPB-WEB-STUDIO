import { useState, useEffect } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { projectsService } from '../services/projectsService';
import type { ProjectItem } from '../types';

export const ProjectVault = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => projectsService.getProjects());
  const [activeFilter, setActiveFilter] = useState<'all' | 'pwa' | 'web' | 'dashboard' | 'database'>('all');

  useEffect(() => {
    // Initial sync from Neon DB
    projectsService.syncFromNeon().then(items => {
      if (items) setProjects(items);
    });

    const handleUpdate = () => {
      setProjects(projectsService.getProjects());
    };
    window.addEventListener('lpb_projects_updated', handleUpdate);
    return () => window.removeEventListener('lpb_projects_updated', handleUpdate);
  }, []);

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'dashboard', label: 'Dashboards' },
    { id: 'pwa', label: 'PWAs' },
    { id: 'web', label: 'Web a Medida' },
    { id: 'database', label: 'Cloud' }
  ];

  return (
    <section id="vault" className="section-padding relative">
      <div className="container-lpb">
        {/* Section Header */}
        <div className="section-header reveal-on-scroll mb-8">
          <div className="subtitle">Portafolio & Trabajos</div>
          <h2 className="title">
            Proyectos <span className="text-gold-gradient">Destacados</span>
          </h2>
          <p className="description">
            Soluciones de software y plataformas diseñadas con precisión técnica y rendimiento optimizado.
          </p>
        </div>

        {/* Minimalist Filter Pills */}
        <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap mb-8 reveal-on-scroll">
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${isActive
                  ? 'bg-slate-900 text-amber-400 border border-amber-500/30 shadow-xs'
                  : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-white hover:text-slate-900'
                  }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Sleek, Balanced 4-Column Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProjects.map((project: ProjectItem) => (
            <article
              key={project.id}
              className="glass-card-interactive p-4 sm:p-4.5 flex flex-col justify-between group project-card-enter border border-slate-200/80 hover:border-amber-500/40 rounded-2xl transition-all duration-300 shadow-[0_8px_25px_-8px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_35px_-10px_rgba(15,23,42,0.09)]"
            >
              <div>
                {/* Thumbnail Showcase Frame */}
                <div className="relative w-full h-38 rounded-xl overflow-hidden mb-3.5 bg-slate-100 border border-slate-200/70">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Left: Category Pill */}
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700/60 shadow-xs">
                    {project.categoryLabel}
                  </div>

                  {/* Top Right: Status Pill */}
                  <div className="absolute top-2.5 right-2.5">
                    {project.isLive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Producción
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/60 text-[10px] font-medium shadow-xs">
                        Arquitectura
                      </span>
                    )}
                  </div>
                </div>

                {/* Title (Standardized Height for Pixel-Perfect Grid Balance) */}
                <div className="h-10 mb-1.5 flex items-center">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                </div>

                {/* Description (Uniform Height) */}
                <p className="text-slate-600 text-xs leading-relaxed mb-3.5 line-clamp-3 h-13.5 overflow-hidden">
                  {project.description}
                </p>
              </div>

              {/* Card Footer: Tech Tags + CTA */}
              <div>
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1 mb-3 pt-2.5 border-t border-slate-200/70">
                  {project.tags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.5 bg-white border border-slate-200/90 rounded text-slate-600 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                {project.projectUrl && project.projectUrl.startsWith('http') ? (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-semibold text-xs transition-all duration-200 shadow-2xs no-underline group/btn"
                  >
                    <span>Ver Proyecto en Vivo</span>
                    <ArrowUpRight size={13} className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                ) : (
                  <a
                    href={project.projectUrl || '#contacto'}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-semibold text-xs transition-all duration-200 shadow-2xs no-underline group/btn"
                  >
                    <span>Consultar Solución</span>
                    <ExternalLink size={12} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectVault;
