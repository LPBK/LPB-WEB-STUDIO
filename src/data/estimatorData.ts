import type { EstimatorOption, EstimatorAddon } from '../types';

export const PROJECT_TYPES: EstimatorOption[] = [
  {
    id: 'pwa-app',
    name: 'Progressive Web App (PWA)',
    description: 'Aplicación ultra-rápida, instalable en móviles y desktop con capacidades offline. Incluye Autenticación Básica (login/registro con correo o proveedor OAuth simple).',
    basePrice: 650,
    estimatedDays: 14,
    icon: 'Smartphone'
  },
  {
    id: 'custom-web',
    name: 'Sitio Web Corporativo & Landing de Élite',
    description: 'Presencia web de alto impacto, diseño visual aristocrático, SEO avanzado y velocidad récord.',
    basePrice: 450,
    estimatedDays: 9,
    icon: 'Globe'
  },
  {
    id: 'enterprise-dashboard',
    name: 'Sistema / Dashboard Empresarial',
    description: 'Panel de control con analíticas, reportes y métricas corporativas. Ya incluye Autenticación Básica de usuarios integrada.',
    basePrice: 950,
    estimatedDays: 21,
    icon: 'LayoutDashboard'
  },
  {
    id: 'fullstack-platform',
    name: 'Plataforma Digital Integral (Full-Stack)',
    description: 'Ecosistema completo: Frontend interactivo + Base de datos en la nube + APIs a medida con autenticación.',
    basePrice: 1400,
    estimatedDays: 30,
    icon: 'Layers'
  }
];

export const ADDON_MODULES: EstimatorAddon[] = [
  {
    id: 'auth-rbac',
    name: 'Gestión Avanzada de Permisos & Roles (RBAC)',
    description: 'Control de acceso granular, permisos por rol (Admin, Editor, Cliente) y seguridad avanzada.',
    price: 180,
    category: 'security'
  },
  {
    id: 'email-setup',
    name: 'Configuración de Correo Corporativo',
    description: 'Creación de cuentas de correo con dominio propio (contacto@tudominio.com), vinculación de registros DNS y configuración Anti-Spam (SPF, DKIM, DMARC).',
    price: 60,
    category: 'feature'
  },
  {
    id: 'social-setup',
    name: 'Setup Inicial de Ecosistema Social',
    description: 'Creación y optimización de perfiles en Instagram, Facebook y TikTok con adaptación gráfica de marca, enlace a la PWA/Landing y configuración de cuenta profesional.',
    price: 150,
    category: 'feature'
  },
  {
    id: 'realtime-sync',
    name: 'Sincronización en Tiempo Real (WebSockets)',
    description: 'Actualización de datos instantánea sin necesidad de recargar la página.',
    price: 220,
    category: 'feature'
  },
  {
    id: 'payment-gateway',
    name: 'Integración de Pasarela de Pagos (Stripe / PayPal)',
    description: 'Cobros seguros, suscripciones recurrentes y emisión de recibos digitales.',
    price: 200,
    category: 'feature'
  },
  {
    id: 'seo-audit',
    name: 'Pack de Optimización Extrema SEO & PWA Score 100',
    description: 'Garantía de rendimiento Lighthouse 98-100%, metaetiquetas OpenGraph y Schema.org.',
    price: 120,
    category: 'infra'
  },
  {
    id: 'db-backup',
    name: 'Arquitectura de Base de Datos & Backups Automatizados',
    description: 'Diseño relacional en PostgreSQL/Supabase con políticas RLS y respaldo diario.',
    price: 190,
    category: 'infra'
  }
];

export const MAINTENANCE_PLAN = {
  id: 'care-plan',
  name: 'Pack de Mantenimiento & Care Plan',
  monthlyPrice: 49,
  description: 'Incluye alojamiento de alta velocidad, respaldos diarios de base de datos, monitoreo 24/7 y 1 hora de soporte/actualizaciones menores al mes.'
};
