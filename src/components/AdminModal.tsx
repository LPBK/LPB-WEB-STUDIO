import { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Clock,
  MessageSquare,
  AlertTriangle,
  Star,
  Sparkles,
  KeyRound,
  RefreshCw,
  LogOut,
  FolderGit2,
  Edit3,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import { adminAuthService } from '../services/adminAuthService';
import { commentsService } from '../services/commentsService';
import { projectsService } from '../services/projectsService';
import type { ExtendedCommentItem } from '../services/commentsService';
import type { ProjectItem } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal = ({ isOpen, onClose }: AdminModalProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authState, setAuthState] = useState(adminAuthService.getAuthState());
  const [shakeError, setShakeError] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'pending' | 'published' | 'projects'>('pending');

  // Comments State
  const [pendingComments, setPendingComments] = useState<ExtendedCommentItem[]>([]);
  const [publishedComments, setPublishedComments] = useState<ExtendedCommentItem[]>([]);
  const [editingComment, setEditingComment] = useState<ExtendedCommentItem | null>(null);

  // Projects State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refresh data from DB
  const refreshAll = async () => {
    setIsLoading(true);
    await Promise.all([
      commentsService.syncFromNeon(),
      projectsService.syncFromNeon()
    ]);
    setPendingComments(commentsService.getPendingComments());
    setPublishedComments(commentsService.getApprovedComments());
    setProjects(projectsService.getProjects());
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      const state = adminAuthService.getAuthState();
      setAuthState(state);
      setPinInput('');
      setAuthError(null);
      if (isAuthenticated) {
        refreshAll();
      }
    }
  }, [isOpen, isAuthenticated]);

  // Lockout countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (authState.isLocked && authState.remainingLockoutSeconds > 0) {
      timer = setInterval(() => {
        setAuthState(prev => {
          if (prev.remainingLockoutSeconds <= 1) {
            return { isLocked: false, remainingLockoutSeconds: 0, remainingAttempts: 3 };
          }
          return { ...prev, remainingLockoutSeconds: prev.remainingLockoutSeconds - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authState.isLocked, authState.remainingLockoutSeconds]);

  if (!isOpen) return null;

  // Handle PIN Submit
  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput || pinInput.length !== 6) return;

    const result = await adminAuthService.verifyPin(pinInput);
    setAuthState(result.state);

    if (result.success) {
      setIsAuthenticated(true);
      setAuthError(null);
      setPinInput('');
      refreshAll();
    } else {
      setAuthError(result.message || 'PIN Incorrecto');
      setPinInput('');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    }
  };

  const handleKeypadPress = async (digit: string) => {
    if (authState.isLocked) return;
    if (pinInput.length < 6) {
      const updated = pinInput + digit;
      setPinInput(updated);
      if (updated.length === 6) {
        const result = await adminAuthService.verifyPin(updated);
        setAuthState(result.state);
        if (result.success) {
          setIsAuthenticated(true);
          setAuthError(null);
          setPinInput('');
          refreshAll();
        } else {
          setAuthError(result.message || 'PIN Incorrecto');
          setPinInput('');
          setShakeError(true);
          setTimeout(() => setShakeError(false), 500);
        }
      }
    }
  };

  // Comments Actions
  const handleApprove = async (id: string) => {
    await commentsService.approveComment(id);
    await refreshAll();
    showActionNotice('✅ Comentario aprobado e incorporado al muro público.');
  };

  const handleReject = async (id: string) => {
    if (window.confirm('¿Deseas rechazar y purgar definitivamente este comentario de la base de datos?')) {
      await commentsService.deleteComment(id);
      await refreshAll();
      showActionNotice('🗑️ Comentario rechazado y eliminado permanentemente de la base de datos.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar definitivamente este comentario?')) {
      await commentsService.deleteComment(id);
      await refreshAll();
      showActionNotice('🗑️ Comentario purgado permanentemente de la base de datos.');
    }
  };

  const handleToggleVerified = async (comment: ExtendedCommentItem) => {
    await commentsService.updateComment(comment.id, { verified: !comment.verified });
    await refreshAll();
  };

  const handleSaveCommentEdit = async () => {
    if (!editingComment) return;
    await commentsService.updateComment(editingComment.id, {
      authorName: editingComment.authorName,
      role: editingComment.role,
      projectName: editingComment.projectName,
      comment: editingComment.comment,
      rating: editingComment.rating
    });
    setEditingComment(null);
    await refreshAll();
    showActionNotice('💾 Cambios guardados en la base de datos.');
  };

  // Projects Actions
  const handleOpenEditProject = (project: ProjectItem) => {
    setIsCreatingNewProject(false);
    setEditingProject({ ...project });
    setTagsInput((project.tags || []).join(', '));
  };

  const handleOpenCreateProject = () => {
    setIsCreatingNewProject(true);
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      tagline: '',
      category: 'web',
      categoryLabel: 'E-Commerce & Web',
      isLive: false,
      statusText: 'Arquitectura LPB',
      description: '',
      imageUrl: '',
      projectUrl: '#contacto',
      highlights: [],
      tags: [],
      accentColor: '#d4af37'
    });
    setTagsInput('');
  };

  const handleDeleteProject = async (id: string, title?: string) => {
    const projectLabel = title ? `"${title}"` : 'este proyecto';
    if (
      window.confirm(
        `¿Deseas eliminar permanentemente ${projectLabel}?\n\nEsta acción ejecutará un DELETE completo en la base de datos de Neon para liberar espacio de almacenamiento.`
      )
    ) {
      setIsLoading(true);
      await projectsService.deleteProject(id);
      await refreshAll();
      showActionNotice('🗑️ Proyecto purgado con DELETE completo de la base de datos.');
      setIsLoading(false);
    }
  };

  const handleSaveProjectEdit = async () => {
    if (!editingProject) return;

    if (!editingProject.title.trim()) {
      alert('Por favor introduce un título para el proyecto.');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    setIsLoading(true);
    if (isCreatingNewProject) {
      await projectsService.createProject({
        ...editingProject,
        tags: parsedTags
      });
      showActionNotice('✨ Nuevo proyecto registrado en la base de datos.');
    } else {
      await projectsService.updateProject(editingProject.id, {
        ...editingProject,
        tags: parsedTags
      });
      showActionNotice('💾 Proyecto actualizado en base de datos y reflejado en el portafolio.');
    }

    setEditingProject(null);
    setIsCreatingNewProject(false);
    await refreshAll();
    setIsLoading(false);
  };

  const showActionNotice = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)] overflow-hidden z-10 my-6 text-slate-100 animate-in zoom-in-95 duration-200">
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 bg-linear-to-r from-amber-600 via-amber-400 to-amber-600" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              {isAuthenticated ? <Unlock size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-['Cinzel'] tracking-wide">
                Panel de Control & Moderación
              </h3>
              <p className="text-xs text-slate-400">
                LPB WEB Studio • Módulo de Gestión Interno
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
                title="Cerrar sesión"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Bloquear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Notice Floating Bar */}
        {actionSuccessMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-6 py-2 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {!isAuthenticated ? (
            /* =========================================================================
               VIEW 1: PIN AUTHENTICATION SCREEN
               ========================================================================= */
            <div className={`max-w-sm mx-auto text-center space-y-6 ${shakeError ? 'animate-shake' : ''}`}>
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                <KeyRound size={32} />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white mb-1.5 font-['Cinzel']">
                  Ingreso de Seguridad
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ingresa tu PIN de 6 dígitos para desbloquear la gestión de testimonios y portafolio.
                </p>
              </div>

              {/* Lockout Notice or Attempts Remaining */}
              {authState.isLocked ? (
                <div className="bg-rose-500/15 border border-rose-500/40 rounded-2xl p-4 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2.5 animate-in fade-in">
                  <Clock size={18} className="animate-spin text-rose-400 shrink-0" />
                  <span>
                    Bloqueo temporal por intentos fallidos. Reintenta en <strong>{authState.remainingLockoutSeconds}s</strong>.
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span>
                    Intentos disponibles: <strong className="text-amber-400">{authState.remainingAttempts}</strong> de 3
                  </span>
                </div>
              )}

              {authError && !authState.isLocked && (
                <div className="bg-rose-500/20 border border-rose-500/50 rounded-xl p-2.5 text-xs text-rose-200 font-semibold flex items-center justify-center gap-2">
                  <AlertTriangle size={14} />
                  <span>{authError}</span>
                </div>
              )}

              {/* PIN Dot Indicators (6 Digits) */}
              <div className="flex items-center justify-center gap-3 py-2">
                {[0, 1, 2, 3, 4, 5].map(idx => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-200 ${pinInput.length > idx
                      ? 'bg-amber-400 border-amber-300 shadow-[0_0_10px_#f59e0b]'
                      : 'border-slate-700 bg-slate-800/80'
                      }`}
                  />
                ))}
              </div>

              {/* Luxury Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-65 mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map(btn => (
                  <button
                    key={btn}
                    type="button"
                    disabled={authState.isLocked}
                    onClick={() => {
                      if (btn === 'C') setPinInput('');
                      else if (btn === '✓') handlePinSubmit();
                      else handleKeypadPress(btn);
                    }}
                    className={`h-12 rounded-2xl font-bold text-base transition-all duration-150 flex items-center justify-center cursor-pointer ${btn === '✓'
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : btn === 'C'
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700'
                        : 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 hover:border-amber-400/50 active:scale-95'
                      } ${authState.isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* =========================================================================
               VIEW 2: AUTHENTICATED ADMIN DASHBOARD
               ========================================================================= */
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 flex-wrap">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'pending'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700'
                    }`}
                >
                  <Clock size={15} />
                  <span>Pendientes de Aprobación</span>
                  {pendingComments.length > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'pending' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500 text-slate-950'
                      }`}>
                      {pendingComments.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('published')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'published'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700'
                    }`}
                >
                  <MessageSquare size={15} />
                  <span>Publicados ({publishedComments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'projects'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700'
                    }`}
                >
                  <FolderGit2 size={15} />
                  <span>Portafolio / Proyectos ({projects.length})</span>
                </button>

                <button
                  onClick={refreshAll}
                  disabled={isLoading}
                  className="ml-auto p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
                  title="Recargar datos de Neon"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin text-amber-400' : ''} />
                </button>
              </div>

              {/* =========================================================================
                 TAB 1: PENDING COMMENTS FOR APPROVAL
                 ========================================================================= */}
              {activeTab === 'pending' && (
                <div className="space-y-4">
                  {pendingComments.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-slate-950/40 rounded-2xl border border-slate-800">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">
                        ¡Bandeja de moderación limpia!
                      </h4>
                      <p className="text-xs text-slate-400">
                        No hay comentarios nuevos pendientes de aprobación en este momento.
                      </p>
                    </div>
                  ) : (
                    pendingComments.map(item => (
                      <div
                        key={item.id}
                        className="bg-slate-950/60 border border-amber-500/30 rounded-2xl p-4 sm:p-5 relative space-y-3 hover:border-amber-500/60 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-xs flex items-center justify-center font-['Cinzel'] shrink-0 border border-white/40">
                              {(item.authorName.charAt(0) || 'L') + (item.authorLastNameInitial?.charAt(0) || '')}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm flex items-center gap-2 flex-wrap">
                                <span>{item.authorName} {item.authorLastNameInitial || ''}</span>
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/40">
                                  Pendiente
                                </span>
                              </div>
                              <div className="text-xs text-slate-400">
                                {item.role || 'Cliente'} • Proyecto: <strong className="text-slate-300">{item.projectName}</strong> ({item.projectType})
                              </div>
                            </div>
                          </div>

                          {/* Rating Stars */}
                          <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl shrink-0 self-start sm:self-auto">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                className={i < item.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-600'}
                              />
                            ))}
                            <span className="text-xs font-bold text-amber-400 ml-1">
                              {item.rating}.0
                            </span>
                          </div>
                        </div>

                        {/* Comment Text */}
                        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-200 leading-relaxed">
                          "{item.comment}"
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                          <span className="text-slate-500 text-[11px]">{item.createdAt}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleReject(item.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer transition-colors"
                            >
                              <Trash2 size={13} /> Rechazar & Purgar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(item.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                            >
                              <CheckCircle2 size={14} /> Aprobar & Publicar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* =========================================================================
                 TAB 2: PUBLISHED COMMENTS MANAGEMENT
                 ========================================================================= */}
              {activeTab === 'published' && (
                <div className="space-y-4">
                  {publishedComments.map(item => (
                    <div
                      key={item.id}
                      className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-slate-700 to-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                            {(item.authorName.charAt(0) || 'L') + (item.authorLastNameInitial?.charAt(0) || '')}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              <span>{item.authorName} {item.authorLastNameInitial || ''}</span>
                              {item.verified && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded-full border border-emerald-500/40">
                                  Verificado
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">
                              {item.role || 'Cliente'} • {item.projectName}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl self-start sm:self-auto">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < item.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-600'}
                            />
                          ))}
                          <span className="text-xs font-bold text-amber-400 ml-1">
                            {item.rating}.0
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                        "{item.comment}"
                      </p>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-slate-500 text-[11px]">{item.createdAt}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleVerified(item)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 cursor-pointer"
                          >
                            {item.verified ? 'Quitar Verificado' : 'Marcar Verificado'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingComment(item)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[11px] font-semibold border border-amber-500/30 cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* =========================================================================
                 TAB 3: PORTFOLIO / PROJECTS MANAGEMENT
                 ========================================================================= */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  {/* Top Bar for Projects Management */}
                  <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-2xl border border-slate-800 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        Proyectos registrados: <strong className="text-amber-400">{projects.length}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={refreshAll}
                        disabled={isLoading}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer transition-colors"
                        title="Sincronizar con Neon DB"
                      >
                        <RefreshCw size={13} className={isLoading ? 'animate-spin text-amber-400' : ''} />
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenCreateProject}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-amber-500/20"
                      >
                        <Plus size={14} />
                        <span>Nuevo Proyecto</span>
                      </button>
                    </div>
                  </div>

                  {projects.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-6 bg-slate-950/20">
                      <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-300 mb-1">No hay proyectos en el portafolio</p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                        Se han eliminado los proyectos de la base de datos para liberar espacio. Puedes añadir uno nuevo o restaurar los de demostración.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleOpenCreateProject}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Crear Proyecto</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            projectsService.resetToDefaults();
                            refreshAll();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
                        >
                          Restaurar Demos
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map(proj => (
                        <div
                          key={proj.id}
                          className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-all"
                        >
                          <div>
                            {/* Image Preview & Badge */}
                            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-900 mb-3 border border-slate-800">
                              {proj.imageUrl ? (
                                <img
                                  src={proj.imageUrl}
                                  alt={proj.title}
                                  className="w-full h-full object-cover"
                                  onError={e => {
                                    (e.target as HTMLImageElement).src = '/assets/inmo.png';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                  <ImageIcon size={24} />
                                </div>
                              )}
                              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-xs border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-400">
                                {proj.categoryLabel}
                              </div>
                              {proj.isLive && (
                                <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/80 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                                  ● En Vivo
                                </div>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-white font-['Cinzel'] line-clamp-1">
                              {proj.title}
                            </h4>
                            <div className="text-[11px] text-amber-400 font-semibold mb-1 line-clamp-1">
                              {proj.tagline}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-2">
                              {proj.description}
                            </p>

                            {/* Tech tags preview */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {(proj.tags || []).slice(0, 4).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                            <span className="text-slate-500 text-[11px]">{proj.statusText}</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj.id, proj.title)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                                title="Eliminar proyecto con DELETE completo de la base de datos"
                              >
                                <Trash2 size={13} />
                                <span>Eliminar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditProject(proj)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
                              >
                                <Edit3 size={13} />
                                <span>Editar Proyecto</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            <span>LPB WEB Studio • Panel de Autenticación Oculto</span>
          </div>
          <span>v2.4.0</span>
        </div>
      </div>

      {/* Comment Edit Sub-Modal */}
      {editingComment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 w-full max-w-lg space-y-4 text-slate-100 shadow-2xl">
            <h4 className="text-base font-bold text-white font-['Cinzel'] flex items-center gap-2">
              <FolderGit2 size={16} className="text-amber-400" />
              Editar Testimonio
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre:</label>
                <input
                  type="text"
                  value={editingComment.authorName}
                  onChange={e => setEditingComment({ ...editingComment, authorName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Empresa / Rol:</label>
                <input
                  type="text"
                  value={editingComment.role || ''}
                  onChange={e => setEditingComment({ ...editingComment, role: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proyecto:</label>
                <input
                  type="text"
                  value={editingComment.projectName}
                  onChange={e => setEditingComment({ ...editingComment, projectName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Comentario:</label>
                <textarea
                  rows={3}
                  value={editingComment.comment}
                  onChange={e => setEditingComment({ ...editingComment, comment: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingComment(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCommentEdit}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-amber-500/20"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Edit Sub-Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 w-full max-w-xl space-y-4 text-slate-100 shadow-2xl my-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white font-['Cinzel'] flex items-center gap-2">
                {isCreatingNewProject ? <Plus size={16} className="text-amber-400" /> : <Edit3 size={16} className="text-amber-400" />}
                {isCreatingNewProject ? 'Registrar Nuevo Proyecto' : 'Editar Información del Proyecto'}
              </h4>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsCreatingNewProject(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Título del Proyecto:</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="Ej. Nexus Flow PWA"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subtítulo / Tagline:</label>
                  <input
                    type="text"
                    value={editingProject.tagline || ''}
                    onChange={e => setEditingProject({ ...editingProject, tagline: e.target.value })}
                    placeholder="Ej. Plataforma E-Commerce de Alto Rendimiento"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoría:</label>
                  <select
                    value={editingProject.category}
                    onChange={e => {
                      const cat = e.target.value as 'web' | 'pwa' | 'dashboard' | 'database';
                      const labels: Record<string, string> = {
                        web: 'E-Commerce & Web',
                        pwa: 'PWA Offline-First',
                        dashboard: 'Dashboard & RBAC',
                        database: 'Cloud & Database'
                      };
                      setEditingProject({
                        ...editingProject,
                        category: cat,
                        categoryLabel: labels[cat] || 'Web a Medida'
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="web">E-Commerce & Web</option>
                    <option value="pwa">PWA Offline-First</option>
                    <option value="dashboard">Dashboard & RBAC</option>
                    <option value="database">Cloud & Database</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Etiqueta de Estado:</label>
                  <input
                    type="text"
                    value={editingProject.statusText || ''}
                    onChange={e => setEditingProject({ ...editingProject, statusText: e.target.value })}
                    placeholder="Ej. En Producción / Arquitectura LPB"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción Detallada:</label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Descripción de la solución técnica, capacidades y arquitectura..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white resize-none focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">URL de la Imagen:</label>
                  <input
                    type="text"
                    value={editingProject.imageUrl || ''}
                    onChange={e => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    placeholder="/assets/inmo.png o https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Enlace del Proyecto (URL):</label>
                  <input
                    type="text"
                    value={editingProject.projectUrl || ''}
                    onChange={e => setEditingProject({ ...editingProject, projectUrl: e.target.value })}
                    placeholder="https://... o #contacto"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingProject.isLive || false}
                    onChange={e => setEditingProject({ ...editingProject, isLive: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                  <span className="text-slate-300 font-semibold">¿Proyecto en Producción / En Vivo?</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tecnologías & Tags (separados por coma):
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="React, TypeScript, Supabase, Tailwind"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {!isCreatingNewProject ? (
                <button
                  type="button"
                  onClick={() => {
                    const p = editingProject;
                    setEditingProject(null);
                    handleDeleteProject(p.id, p.title);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30 font-bold text-xs cursor-pointer transition-colors"
                  title="Eliminar con DELETE completo en la base de datos"
                >
                  <Trash2 size={14} />
                  <span>Eliminar de BD</span>
                </button>
              ) : <div />}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreatingNewProject(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveProjectEdit}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-amber-500/20"
                >
                  {isCreatingNewProject ? 'Registrar Proyecto en BD' : 'Guardar Cambios en Portafolio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModal;
