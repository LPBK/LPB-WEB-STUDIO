import SocialButtons from './SocialButtons';

export const Footer = () => {
  return (
    <footer className="relative bg-slate-900 text-slate-100 border-t border-slate-800 pt-16 pb-12 overflow-hidden">
      <div className="container-lpb">
        {/* Main Footer Row with justify-between */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
          {/* Brand Column */}
          <div className="max-w-md">
            <div className="flex items-center gap-3.5 mb-4">
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
            <p className="text-slate-400 text-sm leading-relaxed">
              Ingeniería de software y desarrollo web a medida. Diseñamos plataformas digitales eficientes, escalables y optimizadas para negocios que buscan distinción y alto rendimiento.
            </p>
          </div>

          {/* Social Media Column */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              ¡Síguenos en redes sociales!
            </span>
            <SocialButtons />
          </div>
        </div>

        {/* Subfooter */}
        <div className="pt-8 border-t border-slate-800/80 flex justify-center items-center text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-200">LPB WEB Studio</strong>. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
