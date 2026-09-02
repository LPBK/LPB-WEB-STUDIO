import { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Send,
  Smartphone,
  Globe,
  LayoutDashboard,
  Layers,
  Calculator,
  Server,
  Mail,
  Share2,
  Shield,
  Zap,
  Database,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROJECT_TYPES, ADDON_MODULES, MAINTENANCE_PLAN } from '../data/estimatorData';

interface EstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

const INCLUDED_IN_ADVANCED_MODULES = ['auth-rbac', 'realtime-sync', 'db-backup'];

export const EstimatorModal = ({ isOpen, onClose, initialServiceId }: EstimatorModalProps) => {
  const defaultType = PROJECT_TYPES.find(p => p.id === initialServiceId) || PROJECT_TYPES[0];
  const [selectedType, setSelectedType] = useState<string>(defaultType.id);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['auth-rbac', 'seo-audit']);
  const [includeMaintenance, setIncludeMaintenance] = useState<boolean>(true);
  const [clientName, setClientName] = useState('');

  if (!isOpen) return null;

  const currentType = PROJECT_TYPES.find(p => p.id === selectedType) || PROJECT_TYPES[0];
  const isAdvancedPackage = selectedType === 'enterprise-dashboard' || selectedType === 'fullstack-platform';

  const toggleAddon = (id: string) => {
    // If it's already bundled in the advanced package, it cannot be unselected or charged
    if (isAdvancedPackage && INCLUDED_IN_ADVANCED_MODULES.includes(id)) {
      return;
    }
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Only bill addons that are NOT already included in the package
  const totalCost = currentType.basePrice + selectedAddons.reduce((acc, addonId) => {
    if (isAdvancedPackage && INCLUDED_IN_ADVANCED_MODULES.includes(addonId)) {
      return acc;
    }
    const addon = ADDON_MODULES.find(a => a.id === addonId);
    return acc + (addon ? addon.price : 0);
  }, 0);

  const additionalAddonsCount = selectedAddons.filter(
    id => !(isAdvancedPackage && INCLUDED_IN_ADVANCED_MODULES.includes(id))
  ).length;

  const estimatedDays = currentType.estimatedDays + additionalAddonsCount * 2;

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
      case 'realtime-sync': return <Zap size={16} className="text-emerald-600" />;
      case 'db-backup': return <Database size={16} className="text-indigo-600" />;
      case 'payment-gateway': return <CreditCard size={16} className="text-emerald-600" />;
      case 'seo-audit': return <Sparkles size={16} className="text-amber-500" />;
      default: return null;
    }
  };

  const handleLaunchWhatsApp = () => {
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 }
    });

    const includedModulesSection = isAdvancedPackage
      ? `💼 *Módulos Ya Incluidos de Fábrica (Sin costo extra):*\n` +
      INCLUDED_IN_ADVANCED_MODULES.map(id => `  • ✅ ${ADDON_MODULES.find(a => a.id === id)?.name} (Incluido)\n`).join('')
      : '';

    const optionalAddonsText = selectedAddons
      .filter(id => !(isAdvancedPackage && INCLUDED_IN_ADVANCED_MODULES.includes(id)))
      .map(id => `  • ➕ ${ADDON_MODULES.find(a => a.id === id)?.name} (+$${ADDON_MODULES.find(a => a.id === id)?.price} RD)`)
      .join('\n');

    const maintenanceText = includeMaintenance
      ? `🔄 *Plan Recurrente:* $${MAINTENANCE_PLAN.monthlyPrice} RD/mes (${MAINTENANCE_PLAN.name})\n`
      : `🔄 *Plan Recurrente:* No seleccionado\n`;

    const message = `👑 *SOLICITUD DE PROYECTO - LPB WEB STUDIO*\n` +
      `-----------------------------------------\n` +
      `👤 *Cliente / Empresa:* ${clientName || 'Nuevo Cliente'}\n` +
      `🚀 *Plataforma Base:* ${currentType.name} ($${currentType.basePrice} RD)\n` +
      `⏱️ *Plazo Estimado:* ~${estimatedDays} días hábiles\n` +
      includedModulesSection +
      (optionalAddonsText ? `\n📦 *Módulos Adicionales Seleccionados:*\n${optionalAddonsText}\n` : '') +
      `\n🛠️ *Suscripción de Mantenimiento:*\n${maintenanceText}\n` +
      `💎 *Inversión Total Estimada:*\n` +
      `  • *Pago Inicial Desarrollo:* $${totalCost} RD\n` +
      (includeMaintenance ? `  • *Mantenimiento & Hosting:* $${MAINTENANCE_PLAN.monthlyPrice} RD/mes\n\n` : `\n`) +
      `Hola LPB WEB Studio, me gustaría agendar una reunión para formalizar este desarrollo.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/18293522441?text=${encoded}`, '_blank');
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
                  className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 border text-left ${isSelected
                    ? 'bg-linear-to-br from-amber-500/15 to-amber-500/5 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                      {getIcon(type.icon)}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      Desde ${type.basePrice} RD
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
          <div className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center justify-between">
            <span>2. MÓDULOS ADICIONALES & ECOSISTEMA DIGITAL:</span>
            {isAdvancedPackage && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ⭐ 3 Módulos Pro incluidos en este paquete
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            {ADDON_MODULES.map((addon) => {
              const isIncludedInPackage = isAdvancedPackage && INCLUDED_IN_ADVANCED_MODULES.includes(addon.id);
              const isChecked = isIncludedInPackage || selectedAddons.includes(addon.id);

              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl transition-all duration-200 gap-2 sm:gap-4 ${isIncludedInPackage
                      ? 'bg-emerald-50/50 border-2 border-emerald-400/80 shadow-xs cursor-default'
                      : isChecked
                        ? 'bg-amber-500/10 border-2 border-amber-500/50 shadow-sm cursor-pointer'
                        : 'bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer'
                    }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${isIncludedInPackage
                          ? 'bg-emerald-600 text-white'
                          : isChecked
                            ? 'bg-amber-600 text-white'
                            : 'border-2 border-slate-400 bg-white'
                        }`}
                    >
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">{addon.name}</span>
                          {getAddonIcon(addon.id)}
                          {isIncludedInPackage && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                              ✓ Incluido en el Paquete
                            </span>
                          )}
                        </div>
                        {/* Mobile Price Badge */}
                        <span className={`sm:hidden font-bold text-xs px-2 py-0.5 rounded-md shrink-0 ${isIncludedInPackage
                            ? 'text-emerald-800 bg-emerald-100'
                            : 'text-amber-700 bg-amber-100'
                          }`}>
                          {isIncludedInPackage ? 'Incluido' : `+$${addon.price} RD`}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {addon.description}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Price */}
                  <div className="hidden sm:block font-bold text-sm whitespace-nowrap shrink-0">
                    {isIncludedInPackage ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-800 text-xs bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-lg">
                        ✓ Incluido
                      </span>
                    ) : (
                      <span className="text-amber-700">+${addon.price} RD</span>
                    )}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${includeMaintenance ? 'bg-amber-600 text-white' : 'border-2 border-slate-400 bg-white'
                    }`}
                >
                  {includeMaintenance && <Check size={14} strokeWidth={3} />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {MAINTENANCE_PLAN.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                    {MAINTENANCE_PLAN.description}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 shrink-0">
                <div className="text-sm sm:text-base font-extrabold text-amber-700 font-['Cinzel']">
                  +${MAINTENANCE_PLAN.monthlyPrice} RD
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Facturación Mensual
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Client Identifier */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
            4. TU NOMBRE O EMPRESA (OPCIONAL):
          </label>
          <input
            type="text"
            placeholder="Ej: Grupo Empresarial Santiago / Ing. Manuel"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
          />
        </div>

        {/* Summary Footer Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 shadow-xl">
          <div>
            <div className="text-[10px] sm:text-xs text-amber-400 uppercase tracking-wider font-bold mb-1">
              Presupuesto Preliminar Estimado
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Cinzel'] flex items-baseline gap-1.5 flex-wrap">
                <span>${totalCost}</span>
                <span className="text-xs sm:text-sm text-slate-300 font-normal">RD</span>
                {includeMaintenance && (
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 block sm:inline sm:ml-1 font-sans">
                    + ${MAINTENANCE_PLAN.monthlyPrice} RD/mes
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>⏱️ Plazo de Entrega: <strong>~{estimatedDays} días hábiles</strong></span>
            </div>
          </div>

          <button
            onClick={handleLaunchWhatsApp}
            className="btn-gold py-3 px-6 sm:py-3.5 sm:px-8 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <Send size={18} />
            <span>Formalizar Cotización por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimatorModal;
