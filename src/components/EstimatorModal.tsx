import { useState } from 'react';
import { X, Sparkles, Check, Send, Smartphone, Globe, LayoutDashboard, Layers, Calculator, Clock, Server, Mail, Share2, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROJECT_TYPES, ADDON_MODULES, MAINTENANCE_PLAN } from '../data/estimatorData';

interface EstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export const EstimatorModal = ({ isOpen, onClose, initialServiceId }: EstimatorModalProps) => {
  const defaultType = PROJECT_TYPES.find(p => p.id === initialServiceId) || PROJECT_TYPES[0];
  const [selectedType, setSelectedType] = useState<string>(defaultType.id);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['auth-rbac', 'seo-audit']);
  const [includeMaintenance, setIncludeMaintenance] = useState<boolean>(true);
  const [clientName, setClientName] = useState('');

  if (!isOpen) return null;

  const currentType = PROJECT_TYPES.find(p => p.id === selectedType) || PROJECT_TYPES[0];

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const totalCost = currentType.basePrice + selectedAddons.reduce((acc, addonId) => {
    const addon = ADDON_MODULES.find(a => a.id === addonId);
    return acc + (addon ? addon.price : 0);
  }, 0);

  const estimatedDays = currentType.estimatedDays + selectedAddons.length * 2;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone size={22} />;
      case 'Globe': return <Globe size={22} />;
      case 'LayoutDashboard': return <LayoutDashboard size={22} />;
      case 'Layers': return <Layers size={22} />;
      default: return <Sparkles size={22} />;
    }
  };

  const getAddonIcon = (addonId: string) => {
    switch (addonId) {
      case 'auth-rbac': return <Shield size={16} className="text-amber-600" />;
      case 'email-setup': return <Mail size={16} className="text-blue-600" />;
      case 'social-setup': return <Share2 size={16} className="text-pink-600" />;
      default: return null;
    }
  };

  const handleLaunchWhatsApp = () => {
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 }
    });

    const activeAddonsText = selectedAddons
      .map(id => `• ${ADDON_MODULES.find(a => a.id === id)?.name} (+$${ADDON_MODULES.find(a => a.id === id)?.price} USD)`)
      .join('\n');

    const maintenanceText = includeMaintenance
      ? `🔄 *Plan Recurrente:* $${MAINTENANCE_PLAN.monthlyPrice} USD/mes (${MAINTENANCE_PLAN.name})\n`
      : `🔄 *Plan Recurrente:* No seleccionado\n`;

    const message = `👑 *SOLICITUD DE PROYECTO - LPB WEB STUDIO*\n` +
      `-----------------------------------------\n` +
      `👤 *Cliente / Empresa:* ${clientName || 'Nuevo Cliente'}\n` +
      `🚀 *Plataforma Base:* ${currentType.name} ($${currentType.basePrice} USD)\n` +
      `⏱️ *Plazo Estimado:* ~${estimatedDays} días hábiles\n\n` +
      `📦 *Módulos Adicionales Seleccionados:*\n${activeAddonsText || '• Configuración Base'}\n\n` +
      `🛠️ *Suscripción de Mantenimiento:*\n${maintenanceText}\n` +
      `💎 *Inversión Total Estimada:*\n` +
      `  • *Pago Inicial Desarrollo:* $${totalCost} USD\n` +
      (includeMaintenance ? `  • *Mantenimiento & Hosting:* $${MAINTENANCE_PLAN.monthlyPrice} USD/mes\n\n` : `\n`) +
      `Hola LPB WEB Studio, me gustaría agendar una reunión para formalizar este desarrollo.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-220 max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 sm:top-6 sm:right-6 bg-slate-100 hover:bg-slate-200 text-slate-600 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors z-10"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 sm:mb-8 pr-8 sm:pr-0">
          <div className="flex items-center gap-1.5 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
            <Calculator size={16} />
            <span>Calculador Inteligente de Proyectos</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
            Cotiza tu Solución con <span className="text-gold-gradient">LPB WEB Studio</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Configura el alcance de tu plataforma, agrega módulos del ecosistema digital y activa tu plan de mantenimiento.
          </p>
        </div>

        {/* Step 1: Base Platform Selector */}
        <div className="mb-6 sm:mb-8">
          <div className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
            1. SELECCIONA EL TIPO DE PLATAFORMA BASE:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {PROJECT_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 ${isSelected
                    ? 'bg-amber-500/10 border-2 border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                    : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <div className={isSelected ? 'text-amber-700' : 'text-slate-600'}>
                      {getIcon(type.icon)}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      Desde ${type.basePrice} USD
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 mb-1">
                    {type.name}
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    {type.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Addon Modules Selection */}
        <div className="mb-6 sm:mb-8">
          <div className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
            2. MÓDULOS ADICIONALES & ECOSISTEMA DIGITAL:
          </div>
          <div className="flex flex-col gap-2.5">
            {ADDON_MODULES.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 gap-2 sm:gap-4 ${isChecked
                    ? 'bg-amber-500/10 border-2 border-amber-500/50 shadow-sm'
                    : 'bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70'
                    }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${isChecked ? 'bg-amber-600 text-white' : 'border-2 border-slate-400 bg-white'
                        }`}
                    >
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900">{addon.name}</span>
                          {getAddonIcon(addon.id)}
                        </div>
                        {/* Mobile Price Badge */}
                        <span className="sm:hidden font-bold text-amber-700 text-xs bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                          +${addon.price} USD
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {addon.description}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Price */}
                  <div className="hidden sm:block font-bold text-amber-700 text-sm whitespace-nowrap shrink-0">
                    +${addon.price} USD
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Maintenance & Care Plan (Recurring) */}
        <div className="mb-6 sm:mb-8">
          <div className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Server size={16} className="text-amber-600" />
            <span>3. PLANES RECURRENTES / MANTENIMIENTO & HOSTING:</span>
          </div>
          <div
            onClick={() => setIncludeMaintenance(!includeMaintenance)}
            className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 border ${includeMaintenance
              ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
              : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70'
              }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${includeMaintenance ? 'bg-amber-600 text-white' : 'border-2 border-slate-400 bg-white'
                    }`}
                >
                  {includeMaintenance && <Check size={14} strokeWidth={3} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{MAINTENANCE_PLAN.name}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {MAINTENANCE_PLAN.description}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 shrink-0">
                <div className="text-sm sm:text-base font-extrabold text-amber-700 font-['Cinzel']">
                  +${MAINTENANCE_PLAN.monthlyPrice} USD
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Facturación Mensual
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Name Input */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
            Tu Nombre o Empresa (Opcional para el brief):
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ej: Alejandro Smith / Mi Empresa"
            className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* Summary Card and WhatsApp Action */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 sm:gap-6 text-white shadow-xl">
          <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 flex-wrap">
            <div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Inversión Inicial Proyecto
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Cinzel'] flex items-baseline gap-1.5 flex-wrap">
                <span>${totalCost}</span>
                <span className="text-xs sm:text-sm text-slate-300 font-normal">USD</span>
                {includeMaintenance && (
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 block sm:inline sm:ml-1 font-sans">
                    + ${MAINTENANCE_PLAN.monthlyPrice} USD/mes
                  </span>
                )}
              </div>
            </div>

            <div className="border-l border-slate-700 pl-4 sm:pl-6">
              <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Plazo de Entrega</div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg font-bold text-slate-100">
                <Clock size={16} className="text-amber-400 sm:w-[18px] sm:h-[18px]" />
                <span>~{estimatedDays} días hábiles</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLaunchWhatsApp}
            className="btn-gold w-full md:w-auto text-center"
            id="estimator-whatsapp-send-btn"
            style={{ padding: '0.85rem 1.4rem', fontSize: '0.9rem' }}
          >
            <Send size={16} />
            <span>Enviar Cotización a WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimatorModal;
