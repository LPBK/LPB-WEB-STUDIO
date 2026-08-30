import type { ServiceItem } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'pwa',
    iconName: 'Smartphone',
    title: 'PWAs de Alto Rendimiento',
    subtitle: 'Experiencia Nativa en Cualquier Dispositivo',
    description: 'Desarrollamos Aplicaciones Web Progresivas (PWA) ultra-rápidas con soporte offline, notificaciones push, instalación directa y tiempos de carga instantáneos.',
    highlights: [
      'Capacidad Offline-First & Service Workers',
      'Instalable en iOS, Android y Desktop sin comisiones de tiendas',
      'Puntuación 100/100 en Google Lighthouse Performance',
      'Sincronización de datos en segundo plano'
    ],
    techTags: ['PWA', 'TypeScript', 'Workbox', 'Vite / React', 'Web APIs'],
    gradientBadge: 'linear-gradient(135deg, #d4af37, #f59e0b)'
  },
  {
    id: 'custom-web',
    iconName: 'Code2',
    title: 'Desarrollo Web a Medida',
    subtitle: 'Plataformas Escalables & Reactivas',
    description: 'Construimos ecosistemas web modernos y plataformas a medida con arquitecturas modulares en TypeScript, garantizando una estética premium y código de nivel militar.',
    highlights: [
      'Arquitectura basada en componentes fuertemente tipados',
      'Diseño UX/UI de lujo con micro-interacciones a 60fps',
      'Optimización SEO avanzada & Metadatos OpenGraph',
      'Cero dependencias innecesarias, máxima velocidad'
    ],
    techTags: ['React', 'Tailwind', 'TypeScript', 'Modern CSS', 'SSR / SPA'],
    gradientBadge: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
  },
  {
    id: 'database-cloud',
    iconName: 'Database',
    title: 'Arquitectura de Datos & Cloud',
    subtitle: 'Escalabilidad & Integración Robusta',
    description: 'Diseño e implementación de bases de datos relacionales, sincronizaciones en tiempo real, autenticación segura y APIs REST / GraphQL de baja latencia.',
    highlights: [
      'Modelado relacional y optimización de consultas SQL',
      'Control de acceso basado en roles (RBAC) & Row Level Security (RLS)',
      'Webhooks, triggers automatizados y streaming en tiempo real',
      'Infraestructura serverless y despliegue continuo (CI/CD)'
    ],
    techTags: ['PostgreSQL', 'Supabase', 'Node.js', 'Redis', 'Cloudflare', 'Neonbase'],
    gradientBadge: 'linear-gradient(135deg, #10b981, #34d399)'
  },
  {
    id: 'dashboards',
    iconName: 'LayoutDashboard',
    title: 'Sistemas & Dashboards de Mando',
    subtitle: 'Control Corporativo en Tiempo Real',
    description: 'Paneles de administración avanzados para empresas: analíticas en vivo, gestión de clientes, emisión de reportes y automatización de flujos de negocio.',
    highlights: [
      'Métricas en vivo y gráficos interactivos de alta fidelidad',
      'Gestión integral de usuarios, permisos y auditoría',
      'Exportación de datos en PDF / Excel / CSV estructurados',
      'Seguridad blindada contra vulnerabilidades OWASP'
    ],
    techTags: ['TypeScript', 'Tailored Dashboards', 'Auth Systems', 'Data Viz'],
    gradientBadge: 'linear-gradient(135deg, #ec4899, #f43f5e)'
  }
];
