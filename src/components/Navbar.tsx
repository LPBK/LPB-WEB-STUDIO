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
    { id: 'opiniones', name: 'Opiniones', href: '#opiniones' },
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 pt-3 sm:pt-4">
      <div
        className={`max-w-7xl mx-auto rounded-3xl transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between ${scrolled
          ? 'bg-white/90 backdrop-blur-xl border border-amber-200/70 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.1),0_0_15px_rgba(212,175,55,0.08)]'
          : 'bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_20px_-8px_rgba(15,23,42,0.05)]'
          }`}
      >
        {/* Brand Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-3.5 no-underline text-inherit group"
          id="nav-brand-logo"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-gold-light shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-transparent transition-transform duration-300 group-hover:scale-105 shrink-0">
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
            <div className="font-['Cinzel'] font-extrabold text-lg sm:text-xl tracking-[0.06em]">
              <span className="text-gold-gradient">LPB WEB</span> <span className="text-slate-900">STUDIO</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links with Active State */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/70 border border-slate-200/80 rounded-full px-3 py-1 backdrop-blur-md shadow-inner">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${isActive
                  ? 'text-amber-950 font-bold bg-amber-500/20 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 bg-amber-500 rounded-full shadow-[0_0_6px_#f59e0b]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-2xl bg-white/80 border border-slate-200 text-slate-800 cursor-pointer hover:bg-slate-100 transition-colors shadow-sm"
          aria-label="Abrir menú"
          id="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2.5 bg-white/95 backdrop-blur-2xl border border-amber-200/70 rounded-3xl p-5 sm:p-6 flex flex-col gap-3 shadow-[0_20px_50px_rgba(15,23,42,0.15)] animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold font-['Cinzel'] py-2.5 px-4 rounded-2xl transition-all duration-200 flex items-center justify-between border-b border-slate-100 ${isActive
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
