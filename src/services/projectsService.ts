import { PROJECTS_DATA } from '../data/projectsData';
import { sql, isNeonConfigured } from '../db/neonClient';
import type { ProjectItem } from '../types';

const STORAGE_KEY = 'lpb_projects_vault_v1';

const getStoredProjects = (): ProjectItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PROJECTS_DATA));
      return PROJECTS_DATA;
    }
    return JSON.parse(raw);
  } catch {
    return PROJECTS_DATA;
  }
};

const saveStoredProjects = (projects: ProjectItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new Event('lpb_projects_updated'));
  } catch (err) {
    console.error('Error saving projects:', err);
  }
};

export const projectsService = {
  getProjects(): ProjectItem[] {
    return getStoredProjects();
  },

  async syncFromNeon(): Promise<ProjectItem[]> {
    if (!isNeonConfigured || !sql) return getStoredProjects();

    try {
      const rows = await sql`
        SELECT 
          id,
          title,
          tagline,
          category,
          category_label as "categoryLabel",
          is_live as "isLive",
          status_text as "statusText",
          description,
          image_url as "imageUrl",
          project_url as "projectUrl",
          highlights,
          tags,
          accent_color as "accentColor"
        FROM projects
      `;

      if (rows && rows.length > 0) {
        const mapped = rows as unknown as ProjectItem[];
        saveStoredProjects(mapped);
        return mapped;
      } else {
        // Only seed projects table in Neon if it's the very first time (never initialized)
        const hasInitialized = localStorage.getItem('lpb_projects_neon_initialized');
        if (!hasInitialized) {
          await this.seedNeonProjects();
          localStorage.setItem('lpb_projects_neon_initialized', 'true');
        } else {
          saveStoredProjects([]);
          return [];
        }
      }
    } catch (err) {
      console.warn('Neon DB projects fetch fallback to local cache:', err);
    }
    return getStoredProjects();
  },

  async seedNeonProjects(): Promise<void> {
    if (!isNeonConfigured || !sql) return;
    try {
      for (const p of PROJECTS_DATA) {
        await sql`
          INSERT INTO projects (id, title, tagline, category, category_label, is_live, status_text, description, image_url, project_url, highlights, tags, accent_color)
          VALUES (
            ${p.id}, 
            ${p.title}, 
            ${p.tagline || null}, 
            ${p.category}, 
            ${p.categoryLabel}, 
            ${p.isLive ?? false}, 
            ${p.statusText || null}, 
            ${p.description}, 
            ${p.imageUrl || null}, 
            ${p.projectUrl || null}, 
            ${JSON.stringify(p.highlights || [])}::jsonb, 
            ${JSON.stringify(p.tags || [])}::jsonb, 
            ${p.accentColor || null}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }
      localStorage.setItem('lpb_projects_neon_initialized', 'true');
    } catch (err) {
      console.error('Error seeding projects in Neon:', err);
    }
  },

  // Create a new project in Neon DB
  async createProject(projectData: Partial<ProjectItem>): Promise<ProjectItem> {
    const id = projectData.id || `proj-${Date.now()}`;
    const newProject: ProjectItem = {
      id,
      title: projectData.title || 'Nuevo Proyecto',
      tagline: projectData.tagline || '',
      category: projectData.category || 'web',
      categoryLabel: projectData.categoryLabel || 'Web a Medida',
      isLive: projectData.isLive ?? false,
      statusText: projectData.statusText || 'Arquitectura LPB',
      description: projectData.description || '',
      imageUrl: projectData.imageUrl || '',
      projectUrl: projectData.projectUrl || '#contacto',
      highlights: projectData.highlights || [],
      tags: projectData.tags || [],
      accentColor: projectData.accentColor || '#d4af37'
    };

    const all = getStoredProjects();
    all.unshift(newProject);
    saveStoredProjects(all);

    if (isNeonConfigured && sql) {
      try {
        await sql`
          INSERT INTO projects (id, title, tagline, category, category_label, is_live, status_text, description, image_url, project_url, highlights, tags, accent_color)
          VALUES (
            ${newProject.id}, 
            ${newProject.title}, 
            ${newProject.tagline || null}, 
            ${newProject.category}, 
            ${newProject.categoryLabel}, 
            ${newProject.isLive ?? false}, 
            ${newProject.statusText || null}, 
            ${newProject.description}, 
            ${newProject.imageUrl || null}, 
            ${newProject.projectUrl || null}, 
            ${JSON.stringify(newProject.highlights || [])}::jsonb, 
            ${JSON.stringify(newProject.tags || [])}::jsonb, 
            ${newProject.accentColor || null}
          )
        `;
      } catch (err) {
        console.error('Error inserting project into Neon DB:', err);
      }
    }

    return newProject;
  },

  // Complete hard DELETE from Neon DB and local cache to free up database storage
  async deleteProject(id: string): Promise<boolean> {
    const all = getStoredProjects();
    const filtered = all.filter(p => p.id !== id);
    saveStoredProjects(filtered);

    if (isNeonConfigured && sql) {
      try {
        await sql`DELETE FROM projects WHERE id = ${id}`;
      } catch (err) {
        console.error('Error executing complete DELETE on Neon DB:', err);
        return false;
      }
    }

    return true;
  },

  async updateProject(id: string, updates: Partial<ProjectItem>): Promise<boolean> {
    const all = getStoredProjects();
    const index = all.findIndex(p => p.id === id);
    if (index === -1) return false;

    all[index] = { ...all[index], ...updates };
    saveStoredProjects(all);

    if (isNeonConfigured && sql) {
      try {
        await sql`
          UPDATE projects
          SET 
            title = COALESCE(${updates.title ?? null}, title),
            tagline = COALESCE(${updates.tagline ?? null}, tagline),
            description = COALESCE(${updates.description ?? null}, description),
            image_url = COALESCE(${updates.imageUrl ?? null}, image_url),
            project_url = COALESCE(${updates.projectUrl ?? null}, project_url),
            status_text = COALESCE(${updates.statusText ?? null}, status_text),
            is_live = COALESCE(${updates.isLive ?? null}, is_live),
            tags = COALESCE(${updates.tags ? JSON.stringify(updates.tags) : null}::jsonb, tags),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
        `;
      } catch (err) {
        console.error('Error updating project in Neon DB:', err);
      }
    }

    return true;
  },

  resetToDefaults(): ProjectItem[] {
    saveStoredProjects(PROJECTS_DATA);
    return PROJECTS_DATA;
  }
};
