import type { ProjectItem } from '../types';

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'aegis-platform',
    title: 'Inmobiliaria del Atlántico',
    tagline: 'Portal Inmobiliario & Dashboard Administrativo',
    category: 'dashboard',
    categoryLabel: 'Dashboard & RBAC',
    isLive: true,
    statusText: 'En Producción',
    description: 'Plataforma web de bienes raíces de alta gama con panel administrativo para gestión integral de propiedades, control de acceso basado en roles (RBAC), arquitectura Supabase y SEO optimizado.',
    imageUrl: '/assets/inmo.png',
    projectUrl: 'https://www.inmobiliariadelatlanticolasterrenas.com/',
    highlights: ['Panel administrativo con roles', 'Indexación SEO y Core Web Vitals', 'Sincronización Cloud Supabase'],
    tags: ['React', 'TypeScript', 'Supabase', 'RBAC', 'Tailwind'],
    accentColor: '#d4af37'
  },
  {
    id: 'nexus-pwa',
    title: 'Nexus Flow PWA',
    tagline: 'Aplicación Web Progresiva Offline-First',
    category: 'pwa',
    categoryLabel: 'PWA Offline-First',
    isLive: false,
    statusText: 'Arquitectura LPB',
    description: 'Aplicación web progresiva diseñada para operar con o sin conexión a internet, incorporando almacenamiento local con IndexedDB, sincronización en segundo plano y experiencia nativa fluida en iOS y Android.',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    projectUrl: '#contacto',
    highlights: ['Caché offline y Service Workers', 'Sincronización automática de datos', 'Instalable como app nativa'],
    tags: ['PWA', 'TypeScript', 'IndexedDB', 'Vite', 'ServiceWorker'],
    accentColor: '#3b82f6'
  },
  {
    id: 'aurum-vault',
    title: 'Aurum Commerce Cloud',
    tagline: 'Plataforma E-Commerce de Alto Rendimiento',
    category: 'web',
    categoryLabel: 'E-Commerce & Web',
    isLive: false,
    statusText: 'Arquitectura LPB',
    description: 'Plataforma de comercio digital de alta velocidad con pasarela de pagos integrada, catálogo dinámico con filtrado reactivo, checkout optimizado y arquitectura orientada a maximizar conversiones.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    projectUrl: '#contacto',
    highlights: ['Checkout seguro con Stripe API', 'Filtrado de productos instantáneo', 'Rendimiento Lighthouse 98+'],
    tags: ['TypeScript', 'Tailwind', 'Stripe API', 'PostgreSQL', 'Next.js'],
    accentColor: '#10b981'
  },
  {
    id: 'chronos-sync',
    title: 'Chronos Realtime Engine',
    tagline: 'Infraestructura Cloud & Data Streaming',
    category: 'database',
    categoryLabel: 'Cloud & Database',
    isLive: false,
    statusText: 'Arquitectura LPB',
    description: 'Infraestructura de microservicios con streaming de datos WebSocket en tiempo real, colas de mensajería con Redis y almacenamiento relacional escalable para sistemas corporativos de alta demanda.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    projectUrl: '#contacto',
    highlights: ['Transmisión WebSocket sub-50ms', 'Caché distribuida en memoria', 'Escalabilidad horizontal'],
    tags: ['Node.js', 'PostgreSQL', 'Redis', 'WebSockets', 'Docker'],
    accentColor: '#f43f5e'
  }
];
