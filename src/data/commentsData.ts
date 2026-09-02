import type { CommentItem } from '../types';

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'rev-1',
    authorName: 'Ing. Alejandro',
    authorLastNameInitial: 'R.',
    role: 'CEO & Fundador',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    projectName: 'Inmobiliaria del Atlántico',
    projectType: 'Portal Inmobiliario & RBAC',
    rating: 5,
    comment: 'La plataforma que construyó LPB WEB Studio transformó completamente nuestra gestión de propiedades en Las Terrenas. La arquitectura con Supabase y el panel con roles son increíblemente rápidos. El SEO mejoró nuestras consultas directas en más de un 180%.',
    createdAt: 'Hace 2 días',
    verified: true,
  }
];

export const AVAILABLE_PROJECT_TYPES = [
  'PWA Offline-First (Móvil & Web)',
  'Plataforma E-Commerce B2B / B2C',
  'Dashboard Administrativo & Cloud',
  'Arquitectura Supabase / PostgreSQL',
  'Sistema a Medida / API Rest'
];
