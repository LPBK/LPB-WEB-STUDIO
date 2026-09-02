-- ==============================================================================
-- LPB WEB STUDIO - TABLAS DE COMENTARIOS, PROYECTOS & SEGURIDAD (NEON POSTGRES)
-- Proyecto: snowy-wind-90628197 | Branch: production | Database: neondb
-- ==============================================================================

-- 1. Tabla de Comentarios
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(100) PRIMARY KEY,
  author_name VARCHAR(255) NOT NULL,
  author_last_name_initial VARCHAR(50),
  role VARCHAR(255),
  project_name VARCHAR(255) NOT NULL,
  project_type VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  avatar_url TEXT,
  created_at VARCHAR(100) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  approved BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments (approved);

-- Testimonio inicial verificado y aprobado
INSERT INTO comments (id, author_name, author_last_name_initial, role, project_name, project_type, rating, comment, created_at, verified, approved)
VALUES 
('rev-1', 'Ing. Alejandro', 'R.', 'CEO & Fundador', 'Inmobiliaria del Atlántico', 'PWA Offline-First (Móvil & Web)', 5, 'La plataforma que construyó LPB WEB Studio transformó completamente nuestra gestión de propiedades en Las Terrenas. La arquitectura con Supabase y el panel con roles son increíblemente rápidos. El SEO mejoró nuestras consultas directas en más de un 180%.', 'Hace 2 días', true, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla de Configuración y Autenticación del PIN Maestro
CREATE TABLE IF NOT EXISTS admin_config (
  key VARCHAR(50) PRIMARY KEY,
  value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PIN Maestro predeterminado almacenado en Base de Datos
INSERT INTO admin_config (key, value)
VALUES ('admin_pin', '202688')
ON CONFLICT (key) DO NOTHING;

-- 3. Tabla de Portafolio / Proyectos
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  category_label VARCHAR(100) NOT NULL,
  is_live BOOLEAN DEFAULT false,
  status_text VARCHAR(100),
  description TEXT NOT NULL,
  image_url TEXT,
  project_url TEXT,
  highlights JSONB,
  tags JSONB,
  accent_color VARCHAR(50),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Proyectos iniciales en producción
INSERT INTO projects (id, title, tagline, category, category_label, is_live, status_text, description, image_url, project_url, highlights, tags, accent_color)
VALUES 
('aegis-platform', 'Inmobiliaria del Atlántico', 'Portal Inmobiliario & Dashboard Administrativo', 'dashboard', 'Dashboard & RBAC', true, 'En Producción', 'Plataforma web de bienes raíces de alta gama con panel administrativo para gestión integral de propiedades, control de acceso basado en roles (RBAC), arquitectura Supabase y SEO optimizado.', '/assets/inmo.png', 'https://www.inmobiliariadelatlanticolasterrenas.com/', '["Panel administrativo con roles", "Indexación SEO y Core Web Vitals", "Sincronización Cloud Supabase"]'::jsonb, '["React", "TypeScript", "Supabase", "RBAC", "Tailwind"]'::jsonb, '#d4af37'),
('nexus-pwa', 'Nexus Flow PWA', 'Aplicación Web Progresiva Offline-First', 'pwa', 'PWA Offline-First', false, 'Arquitectura LPB', 'Aplicación web progresiva diseñada para operar con o sin conexión a internet, incorporando almacenamiento local con IndexedDB, sincronización en segundo plano y experiencia nativa fluida en iOS y Android.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop', '#contacto', '["Caché offline y Service Workers", "Sincronización automática de datos", "Instalable como app nativa"]'::jsonb, '["PWA", "TypeScript", "IndexedDB", "Vite", "ServiceWorker"]'::jsonb, '#3b82f6'),
('aurum-vault', 'Aurum Commerce Cloud', 'Plataforma E-Commerce de Alto Rendimiento', 'web', 'E-Commerce & Web', false, 'Arquitectura LPB', 'Plataforma de comercio digital de alta velocidad con pasarela de pagos integrada, catálogo dinámico con filtrado reactivo, checkout optimizado y arquitectura orientada a maximizar conversiones.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', '#contacto', '["Checkout seguro con Stripe API", "Filtrado de productos instantáneo", "Rendimiento Lighthouse 98+"]'::jsonb, '["TypeScript", "Tailwind", "Stripe API", "PostgreSQL", "Next.js"]'::jsonb, '#10b981'),
('chronos-sync', 'Chronos Realtime Engine', 'Infraestructura Cloud & Data Streaming', 'database', 'Cloud & Database', false, 'Arquitectura LPB', 'Infraestructura de microservicios con streaming de datos WebSocket en tiempo real, colas de mensajería con Redis y almacenamiento relacional escalable para sistemas corporativos de alta demanda.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop', '#contacto', '["Transmisión WebSocket sub-50ms", "Caché distribuida en memoria", "Escalabilidad horizontal"]'::jsonb, '["Node.js", "PostgreSQL", "Redis", "WebSockets", "Docker"]'::jsonb, '#f43f5e')
ON CONFLICT (id) DO NOTHING;
