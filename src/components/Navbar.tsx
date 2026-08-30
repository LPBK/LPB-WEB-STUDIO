import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenEstimator: () => void;
}

export const Navbar = ({ onOpenEstimator }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  const navLinks = [
    { id: 'inicio', name: 'Inicio', href: '#inicio' },
    { id: 'servicios', name: 'Servicios', href: '#servicios' },
    { id: 'terminal', name: 'Arsenal TS', href: '#terminal' },
    { id: 'vault', name: 'Portafolio', href: '#vault' },
    { id: 'filosofia', name: 'Filosofía', href: '#filosofia' },
    { id: 'contacto', name: 'Contacto', href: '#contacto' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = navLinks.map(link => link.id);
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'py-3 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06)]'
        : 'py-5 bg-transparent border-b border-transparent'
        }`}
    >
      <div className="container-lpb flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-3.5 no-underline text-inherit group"
          id="nav-brand-logo"
        >
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gold-light shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-transparent transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/LPBlogo.png"
              alt="LPB WEB Studio"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/lpb_crest.jpg';
              }}
            />
          </div>
          <div>
            <div className="font-['Cinzel'] font-extrabold text-xl tracking-[0.06em]">
              <span className="text-gold-gradient">LPB WEB</span> <span className="text-slate-900">STUDIO</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links with Active State */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-white/70 border border-slate-200/80 rounded-full px-3.5 py-1.5 backdrop-blur-md shadow-sm">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                  ? 'text-[#854d0e] font-bold bg-amber-500/15 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-500 rounded-full shadow-[0_0_6px_#f59e0b]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-white/80 border border-slate-200 text-slate-800 cursor-pointer hover:bg-slate-100 transition-colors shadow-sm"
          aria-label="Abrir menú"
          id="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold font-['Cinzel'] py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-between border-b border-slate-100 ${isActive
                  ? 'text-[#854d0e] bg-amber-500/10 border-amber-500/30'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                <span>{link.name}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />}
              </a>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenEstimator();
            }}
            className="btn-gold w-full mt-2"
          >
            <Sparkles size={18} />
            <span>Cotizar Proyecto en Tiempo Real</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
