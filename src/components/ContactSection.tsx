import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send, CheckCircle2, Shield, MapPin, } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SocialButtons } from './SocialButtons';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'PWA de Alto Rendimiento',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    const brief = `👑 *NUEVO MENSAJE DE CONTACTO - LPB WEB STUDIO*\n` +
      `-----------------------------------------\n` +
      `👤 *Nombre:* ${formData.name}\n` +
      `📧 *Email:* ${formData.email}\n` +
      `🎯 *Interés:* ${formData.projectType}\n` +
      `💬 *Mensaje:* ${formData.message}`;

    const encoded = encodeURIComponent(brief);
    setTimeout(() => {
      window.open(`https://wa.me/18293522441?text=${encoded}`, '_blank');
    }, 800);
  };

  return (
    <section id="contacto" className="section-padding relative">
      <div className="container-lpb">
        <div className="section-header reveal-on-scroll">
          <div className="subtitle">Canal Directo</div>
          <h2 className="title">
            Inicia tu <span className="text-gold-gradient">Próximo Proyecto</span>
          </h2>
          <p className="description">
            Cuéntanos tu visión o contáctanos directamente a través de WhatsApp, llamada telefónica o redes oficiales.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start'
          }}
          className="contact-grid"
        >
          {/* Left Column: Official Social Channels & Brand Details */}
          <div className="glass-panel p-10 reveal-on-scroll reveal-stagger-1">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-full border-2 border-gold-light overflow-hidden bg-transparent shadow-sm">
                <img
                  src="/assets/LPBlogo.png"
                  alt="LPB Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/lpb_crest.jpg';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">LPB WEB Studio</h3>
                <div className="text-xs text-amber-700 font-bold tracking-wider uppercase">Sello Britania Oficial</div>
              </div>
            </div>
            {/* Social Media Highlight Box */}
            <div className="bg-slate-200/60 border border-slate-300/70 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                Nuestras Redes Sociales Oficiales:
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Conéctate con nosotros en Facebook, TikTok e Instagram para ver actualizaciones, demos y novedades.
              </p>
              <SocialButtons variant="pill" />
            </div>

            {/* Quick Details */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3 text-slate-700 text-sm">
                <MapPin size={18} className="text-amber-600 shrink-0" />
                <span>Desarrollo Global & Remoto</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-sm">
                <Shield size={18} className="text-amber-600 shrink-0" />
                <span>Acuerdos de Confidencialidad & Propiedad Intelectual 100% Tuya</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-panel p-10 reveal-on-scroll reveal-stagger-2">
            {sent ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  ¡Mensaje Preparado!
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Se ha generado tu solicitud y abierto el canal de WhatsApp al <strong>+1 (829) 352-2441</strong> para atenderte de inmediato.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-outline text-xs"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Tu Nombre / Empresa:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Alejandro Smith / Nexus Corp"
                    className="w-full px-4 py-3 bg-white/90 border border-slate-300 rounded-xl text-slate-900 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Correo Electrónico:
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@tuempresa.com"
                    className="w-full px-4 py-3 bg-white/90 border border-slate-300 rounded-xl text-slate-900 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Servicio de Interés Principal:
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="PWA de Alto Rendimiento">PWA de Alto Rendimiento (Offline / Móvil)</option>
                    <option value="Desarrollo Web a Medida">Desarrollo Web & Landing de Élite</option>
                    <option value="Dashboard Empresarial & RBAC">Dashboard Empresarial & Gestión de Roles</option>
                    <option value="Arquitectura Cloud & Base de Datos">Arquitectura Cloud & Base de Datos</option>
                    <option value="Consultoría Integral">Consultoría & Arquitectura Integral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Detalles del Proyecto:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos sobre tus objetivos, funcionalidades deseadas o fecha tentativa de lanzamiento..."
                    className="w-full px-4 py-3 bg-white/90 border border-slate-300 rounded-xl text-slate-900 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full py-3.5 mt-2"
                  id="contact-submit-btn"
                >
                  <Send size={18} />
                  <span>Enviar y Abrir Canal WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
