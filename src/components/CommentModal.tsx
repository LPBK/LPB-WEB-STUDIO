import { useState } from 'react';
import { X, CheckCircle, Send, Star, ShieldCheck, Sparkles, MessageSquare, Database } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPANY_INFO } from '../data/socialData';
import type { CommentFormData } from '../types';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentData: CommentFormData;
  onConfirmedSuccess: () => void;
}

export const CommentModal = ({
  isOpen,
  onClose,
  commentData,
  onConfirmedSuccess
}: CommentModalProps) => {
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const fullName = `${commentData.authorName.trim()} ${commentData.authorLastNameInitial ? commentData.authorLastNameInitial.trim() : ''}`.trim();
  const initials = (commentData.authorName.charAt(0) + (commentData.authorLastNameInitial ? commentData.authorLastNameInitial.charAt(0) : '')).toUpperCase() || 'LP';

  const handleConfirmAndSaveToDB = () => {
    setIsSending(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsSending(false);
      onConfirmedSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-amber-200/80 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25)] overflow-hidden z-10 my-8">
        {/* Decorative Top Accent */}
        <div className="h-2 bg-linear-to-r from-amber-500 via-amber-300 to-amber-600" />

        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-700">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Cinzel'] tracking-wide">
                Validación de Comentario
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Protocolo de Calidad & Verificación LPB Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Evaluation Notice Banner */}
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
            <ShieldCheck size={24} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-amber-950 font-bold block mb-1">
                Proceso de Moderación & Base de Datos
              </strong>
              ¡Muchas gracias por compartir tu experiencia! Al confirmar, tu reseña se registrará directamente en nuestra base de datos para su verificación en el panel de control antes de mostrarse en el muro público.
            </div>
          </div>

          {/* Live Preview Card */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-amber-600" />
              Vista Previa de cómo se verá tu reseña:
            </div>

            <div className="glass-panel p-5 sm:p-6 border border-amber-200/60 bg-linear-to-br from-white/95 to-amber-50/30 rounded-2xl shadow-sm">
              {/* Card Top: Avatar, Names, Rating */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {commentData.avatarUrl ? (
                    <img
                      src={commentData.avatarUrl}
                      alt={fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-white shadow-sm font-['Cinzel']">
                      {initials}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-base">
                        {fullName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                        <CheckCircle size={10} /> Verificado
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {commentData.role.trim() || 'Cliente Distinguido'}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < commentData.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}
                    />
                  ))}
                  <span className="text-xs font-bold text-amber-900 ml-1">
                    {commentData.rating}.0
                  </span>
                </div>
              </div>

              {/* Project Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-100/90 border border-slate-200 px-3 py-1 rounded-lg text-xs text-slate-700 font-medium mb-3">
                <span className="text-amber-600 font-bold">Proyecto:</span>
                <span className="font-semibold text-slate-900">{commentData.projectName}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 text-[11px]">{commentData.projectType}</span>
              </div>

              {/* Comment Body */}
              <p className="text-slate-700 text-sm leading-relaxed italic bg-white/70 p-3.5 rounded-xl border border-slate-200/50 mb-3">
                "{commentData.comment}"
              </p>
            </div>
          </div>

          {/* Direct DB Notification Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
            <Database size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              Al pulsar <strong>"Confirmar y Registrar"</strong>, se almacenará directamente en el servidor seguro de <span className="text-slate-900 font-semibold">{COMPANY_INFO.name}</span> para su aprobación inmediata en el panel de administración.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50/90 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
          >
            Modificar datos
          </button>
          <button
            type="button"
            disabled={isSending}
            onClick={handleConfirmAndSaveToDB}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Send size={16} />
            {isSending ? 'Guardando en BD...' : 'Confirmar y Registrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
