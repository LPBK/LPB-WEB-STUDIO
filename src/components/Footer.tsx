import { useRef } from 'react';
import SocialButtons from './SocialButtons';
import { Phone, Mail, Globe } from 'lucide-react';
import { COMPANY_INFO } from '../data/socialData';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer = ({ onOpenAdmin }: FooterProps) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1800);
    }
  };

  return (
    <footer className="relative bg-slate-900 text-slate-100 border-t border-slate-800 pt-16 pb-12 overflow-hidden">
      <div className="container-lpb">
        {/* Main Footer Row with justify-between */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-12">
          {/* Brand Column */}
          <div className="max-w-md">
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-3.5 mb-4 select-none w-fit cursor-default"
            >
              <div className="w-11 h-11 rounded-full border-2 border-amber-500 overflow-hidden bg-transparent shadow-sm">
                <img
                  src="/assets/LPBlogo.png"
                  alt="LPB Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/lpb_crest.jpg';
                  }}
                />
              </div>
              <div className="font-['Cinzel'] font-extrabold text-xl text-white">
                <span className="text-amber-400">LPB WEB</span> STUDIO
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Ingeniería de software y desarrollo web a medida. Diseñamos plataformas digitales eficientes, escalables y optimizadas para negocios que buscan distinción y alto rendimiento.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-300">
              <a
                href="tel:+18293522441"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors"
              >
                <Phone size={14} className="text-amber-400" />
                <span>+1 (829) 352-2441 (Llamadas & WhatsApp)</span>
              </a>
              <a
                href="mailto:contacto@lpbwebstudio.dev"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors"
              >
                <Mail size={14} className="text-amber-400" />
                <span>contacto@lpbwebstudio.dev</span>
              </a>
              <a
                href="https://www.lpbwebstudio.dev/"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors"
              >
                <Globe size={14} className="text-amber-400" />
                <span>www.lpbwebstudio.dev</span>
              </a>
            </div>
          </div>

          {/* Social Media Column */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              ¡Síguenos en redes sociales & contacto directo!
            </span>
            <SocialButtons />
          </div>
        </div>

        {/* Subfooter */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-200">LPB WEB Studio</strong>. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.lpbwebstudio.dev/" className="hover:text-amber-400 transition-colors">
              {COMPANY_INFO.website}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
