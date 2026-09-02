import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import {
  Star,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Upload,
  User,
  Briefcase,
  FolderGit2,
  Send,
  Award,
  Trash2
} from 'lucide-react';
import { AVAILABLE_PROJECT_TYPES } from '../data/commentsData';
import { commentsService } from '../services/commentsService';
import { CommentModal } from './CommentModal';
import type { CommentItem, CommentFormData } from '../types';

export const CommentsSection = () => {
  const [comments, setComments] = useState<CommentItem[]>(() => commentsService.getApprovedComments());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form State
  const [formData, setFormData] = useState<CommentFormData>({
    authorName: '',
    authorLastNameInitial: '',
    role: '',
    projectName: '',
    projectType: AVAILABLE_PROJECT_TYPES[0],
    rating: 5,
    comment: '',
    avatarUrl: ''
  });

  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with DB changes
  useEffect(() => {
    // Initial sync from Neon DB
    commentsService.syncFromNeon().then(items => {
      if (items) setComments(items.filter(c => c.approved !== false));
    });

    const handleUpdate = () => {
      setComments(commentsService.getApprovedComments());
    };
    window.addEventListener('lpb_comments_updated', handleUpdate);
    return () => window.removeEventListener('lpb_comments_updated', handleUpdate);
  }, []);

  // Avatar Upload Handler
  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setFormError('La imagen debe ser menor a 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
          setFormError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData(prev => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Submit Handler
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.authorName.trim()) {
      setFormError('Por favor ingresa tu nombre.');
      return;
    }
    if (!formData.projectName.trim()) {
      setFormError('Por favor indica el nombre del proyecto desarrollado.');
      return;
    }
    if (!formData.comment.trim() || formData.comment.trim().length < 15) {
      setFormError('El comentario debe contener al menos 15 caracteres descriptivos.');
      return;
    }

    setFormError(null);
    setIsModalOpen(true);
  };

  // Callback when confirmed in modal: Save to Neon DB
  const handleConfirmedSuccess = () => {
    setIsSubmittedSuccess(true);

    // Submit to DB service
    commentsService.submitComment(formData);

    // Reset form after short delay
    setTimeout(() => {
      setFormData({
        authorName: '',
        authorLastNameInitial: '',
        role: '',
        projectName: '',
        projectType: AVAILABLE_PROJECT_TYPES[0],
        rating: 5,
        comment: '',
        avatarUrl: ''
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1000);
  };

  // Filter Comments
  const filteredComments = comments.filter(c => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === '5stars') return c.rating === 5;
    if (selectedCategory === 'pwa') return c.projectType.toLowerCase().includes('pwa');
    if (selectedCategory === 'web') return c.projectType.toLowerCase().includes('inmobiliario') || c.projectType.toLowerCase().includes('web') || c.projectType.toLowerCase().includes('e-commerce');
    return true;
  });

  const ratingTexts: Record<number, string> = {
    1: 'Deficiente (1/5)',
    2: 'Regular (2/5)',
    3: 'Bueno (3/5)',
    4: 'Muy Bueno (4/5)',
    5: '¡Excelente & Excepcional! (5/5)'
  };

  return (
    <section id="opiniones" className="section-padding relative">
      <div className="container-lpb">
        {/* Section Header */}
        <div className="section-header reveal-on-scroll">
          <div className="subtitle flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            Muro de Reputación & Feedback
          </div>
          <h2 className="title">
            Experiencias de <span className="text-gold-gradient">Nuestros Clientes</span>
          </h2>
          <p className="description">
            Descubre las valoraciones de quienes han confiado en LPB WEB Studio para arquitecturas web, PWAs y plataformas digitales de alto impacto.
          </p>

          {/* Trust Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3.5 shadow-sm text-center">
              <div className="text-2xl font-extrabold text-slate-900 font-['Cinzel'] flex items-center justify-center gap-1">
                5.0 <Star size={18} className="fill-amber-400 text-amber-500" />
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Valoración Promedio
              </div>
            </div>
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3.5 shadow-sm text-center">
              <div className="text-2xl font-extrabold text-emerald-600 font-['Cinzel']">
                100%
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Satisfacción Total
              </div>
            </div>
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3.5 shadow-sm text-center col-span-2 sm:col-span-1">
              <div className="text-2xl font-extrabold text-amber-700 font-['Cinzel'] flex items-center justify-center gap-1">
                <Award size={20} className="text-amber-500" /> Sello LPB
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Calidad Auditada
              </div>
            </div>
          </div>
        </div>

        {/* Master 2-Subsection Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================================================
              SUBSECCIÓN 1: MURO DE COMENTARIOS DEJADOS POR LOS DEMÁS (7 COLUMNS)
              ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-amber-600" />
                  Comentarios Destacados
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/60 ml-1">
                    {comments.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Reseñas auditadas y verificadas con proyectos entregados.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('5stars')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${selectedCategory === '5stars'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  <Star size={12} className="fill-current" /> 5 Estrellas
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('pwa')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${selectedCategory === 'pwa'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  PWAs
                </button>
              </div>
            </div>

            {/* List of Comment Cards Container with Border Radius and Custom Scrollbar */}
            <div className="glass-panel p-2.5 sm:p-3.5 rounded-3xl border border-slate-200/80 bg-slate-50/40 shadow-inner">
              <div className="space-y-4 max-h-212.5 overflow-y-auto pr-2 custom-scrollbar">
                {filteredComments.length === 0 ? (
                  <div className="glass-panel p-8 text-center text-slate-500 rounded-2xl">
                    No hay comentarios en este filtro actualmente.
                  </div>
                ) : (
                  filteredComments.map((item) => {
                    const authorFull = `${item.authorName} ${item.authorLastNameInitial || ''}`.trim();
                    const initials = (item.authorName.charAt(0) + (item.authorLastNameInitial ? item.authorLastNameInitial.charAt(0) : '')).toUpperCase() || 'LP';

                    return (
                      <div
                        key={item.id}
                        className="glass-card-interactive p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm transition-all duration-300 hover:shadow-md"
                      >
                        {/* Top Row: Avatar + Name + Verified Badge + Stars */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3.5">
                            {item.avatarUrl ? (
                              <img
                                src={item.avatarUrl}
                                alt={authorFull}
                                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 via-amber-500 to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-white shadow-sm font-['Cinzel'] shrink-0">
                                {initials}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                                  {authorFull}
                                </h4>
                                {item.verified && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-[0_1px_3px_rgba(5,150,105,0.08)]">
                                    <CheckCircle2 size={11} className="text-emerald-600" /> Verificado
                                  </span>
                                )}
                              </div>
                              {item.role && (
                                <div className="text-xs text-slate-500 font-medium">
                                  {item.role}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-0.5 bg-amber-50/80 border border-amber-200/60 px-2.5 py-1 rounded-xl shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < item.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}
                              />
                            ))}
                            <span className="text-xs font-bold text-amber-900 ml-1">
                              {item.rating}.0
                            </span>
                          </div>
                        </div>

                        {/* Project Tag Banner */}
                        <div className="inline-flex items-center gap-1.5 bg-linear-to-r from-amber-50/90 to-slate-50 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs text-slate-800 font-medium mb-3.5 flex-wrap">
                          <FolderGit2 size={13} className="text-amber-700 shrink-0" />
                          <span className="text-amber-900 font-bold">Proyecto:</span>
                          <span className="font-bold text-slate-900">{item.projectName}</span>
                          <span className="text-amber-400">•</span>
                          <span className="text-slate-600 font-semibold text-[11px]">{item.projectType}</span>
                        </div>

                        {/* Comment Message */}
                        <p className="text-slate-700 text-sm leading-relaxed mb-4 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                          "{item.comment}"
                        </p>

                        {/* Card Bottom Row: Date */}
                        <div className="flex items-center justify-end pt-2 border-t border-slate-100 text-xs text-slate-400">
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              SUBSECCIÓN 2: FORMULARIO PARA DEJAR UN COMENTARIO (5 COLUMNS)
              ========================================================================= */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200/70 bg-linear-to-br from-white/95 via-amber-50/20 to-white/90 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.06)] sticky top-24">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-700">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Cinzel']">
                  Dejar un Comentario
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Comparte tu testimonio sobre el software, PWA o desarrollo web realizado con nosotros. Al enviar, validaremos tu reseña con un aviso antes de notificar al sistema.
              </p>

              {isSubmittedSuccess && (
                <div className="mb-5 bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">¡Comentario enviado para evaluación!</strong>
                    Se ha generado la ficha y notificado a la empresa para su verificación oficial.
                  </div>
                </div>
              )}

              {formError && (
                <div className="mb-5 bg-rose-50 border border-rose-300 rounded-xl p-3 text-rose-700 text-xs font-semibold">
                  ⚠️ {formError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* 1. Star Rating Interactive Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Calificación del Proyecto:
                  </label>
                  <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-3 shadow-inner">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map(starNum => (
                        <button
                          key={starNum}
                          type="button"
                          onMouseEnter={() => setHoverRating(starNum)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setFormData(prev => ({ ...prev, rating: starNum }))}
                          className="p-1 rounded-lg transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                          aria-label={`Calificar con ${starNum} estrellas`}
                        >
                          <Star
                            size={22}
                            className={
                              (hoverRating || formData.rating) >= starNum
                                ? 'fill-amber-400 text-amber-500 drop-shadow-[0_1px_4px_rgba(245,158,11,0.4)]'
                                : 'text-slate-300'
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-amber-900 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                      {ratingTexts[hoverRating || formData.rating]}
                    </span>
                  </div>
                </div>

                {/* 2. Names Row: First Name & Last Name Initial */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tu Nombre <span className="text-amber-600">*</span>:
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Ing. Carlos"
                        value={formData.authorName}
                        onChange={e => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                        className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Inicial / Apellido:
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="Ej. M."
                      value={formData.authorLastNameInitial}
                      onChange={e => setFormData(prev => ({ ...prev, authorLastNameInitial: e.target.value }))}
                      className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* 3. Role / Company (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Empresa <span className="text-slate-400 font-normal lowercase">(opcional)</span>:
                  </label>
                  <div className="relative">
                    <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ej. Mi-empresa"
                      value={formData.role}
                      onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* 4. Project Name & Project Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nombre del Proyecto <span className="text-amber-600">*</span>:
                    </label>
                    <div className="relative">
                      <FolderGit2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Mi proyecto"
                        value={formData.projectName}
                        onChange={e => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                        className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tipo de Proyecto:
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={e => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                      className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      {AVAILABLE_PROJECT_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Photo Upload or Initials Preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Foto o Avatar <span className="text-slate-400 font-normal lowercase">(opcional)</span>:
                  </label>
                  <div className="flex items-center gap-3 bg-white border border-slate-200/90 rounded-2xl p-2.5">
                    {formData.avatarUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center font-['Cinzel'] shrink-0 border border-white shadow-sm">
                        {(formData.authorName.charAt(0) || 'L') + (formData.authorLastNameInitial.charAt(0) || 'P')}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-600 font-medium truncate">
                        {formData.avatarUrl ? 'Foto cargada con éxito' : 'Sube tu foto o se usarán tus iniciales'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors">
                          <Upload size={12} />
                          <span>{formData.avatarUrl ? 'Cambiar Foto' : 'Subir Imagen'}</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                        {formData.avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold cursor-pointer"
                          >
                            <Trash2 size={12} /> Quitar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Comment Textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tu Reseña / Comentario <span className="text-amber-600">*</span>:
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Cuéntanos tu experiencia trabajando con LPB WEB Studio, resultados obtenidos, velocidad, diseño, etc..."
                    value={formData.comment}
                    onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full bg-white border border-slate-200/90 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 leading-relaxed resize-none"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                    <span>Mínimo 15 caracteres</span>
                    <span>{formData.comment.length} caracteres</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full btn-gold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-amber-900/10 cursor-pointer"
                >
                  <Send size={16} />
                  <span>Enviar comentario</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & Evaluation Modal */}
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        commentData={formData}
        onConfirmedSuccess={handleConfirmedSuccess}
      />
    </section>
  );
};

export default CommentsSection;
