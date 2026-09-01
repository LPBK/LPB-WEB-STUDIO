import type { ProjectItem } from '../types';

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'aegis-platform',
    title: 'INMOBILIARIA DEL ATLANTICO LAS TERRENAS',
    category: 'dashboard',
    categoryLabel: 'Dashboard & RBAC',
    description: 'Plataforma web inmobiliaria con panel administrativo para gestión de propiedades, roles de usuario y SEO optimizado.',
    imageUrl: '/assets/inmo.png',
    projectUrl: 'https://www.inmobiliariadelatlanticolasterrenas.com/',
    tags: ['React', 'TypeScript', 'Supabase', 'RBAC'],
    accentColor: '#d4af37'
  },
  {
    id: 'nexus-pwa',
    title: 'Nexus Flow PWA',
    category: 'pwa',
    categoryLabel: 'PWA Offline-First',
    description: 'Aplicación web progresiva con almacenamiento local, sincronización en segundo plano y soporte móvil nativo.',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
    projectUrl: '#contacto',
    tags: ['PWA', 'TypeScript', 'IndexedDB', 'Vite'],
    accentColor: '#3b82f6'
  },
  {
    id: 'aurum-vault',
    title: 'Aurum Commerce Cloud',
    category: 'web',
    categoryLabel: 'E-Commerce & Web',
    description: 'Plataforma web de alta velocidad con pasarela de pagos integrada, catálogo dinámico y diseño ultra-optimizado.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    projectUrl: '#contacto',
    tags: ['TypeScript', 'Tailwind', 'Stripe API', 'PostgreSQL'],
    accentColor: '#10b981'
  },
  {
    id: 'chronos-sync',
    title: 'Chronos Realtime Engine',
    category: 'database',
    categoryLabel: 'Cloud & Database',
    description: 'Infraestructura de microservicios con streaming de datos WebSocket y backend escalable en la nube.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
    projectUrl: '#contacto',
    tags: ['Node.js', 'PostgreSQL', 'Redis', 'WebSockets'],
    accentColor: '#f43f5e'
  }
];
