import { sql, isNeonConfigured } from '../db/neonClient';
import type { CommentItem, CommentFormData } from '../types';

export interface ExtendedCommentItem extends CommentItem {
  approved?: boolean;
}

const STORAGE_KEY = 'lpb_comments_db_v1';

// Initial DB seed if empty: clean empty array so it is 100% database-driven
const getStoredComments = (): ExtendedCommentItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveStoredComments = (comments: ExtendedCommentItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    window.dispatchEvent(new Event('lpb_comments_updated'));
  } catch (err) {
    console.error('Error saving comments:', err);
  }
};

export const commentsService = {
  // Sync comments directly from Neon DB table
  async syncFromNeon(): Promise<ExtendedCommentItem[]> {
    if (!isNeonConfigured || !sql) {
      return getStoredComments();
    }

    try {
      const rows = await sql`
        SELECT 
          id,
          author_name as "authorName",
          author_last_name_initial as "authorLastNameInitial",
          role,
          project_name as "projectName",
          project_type as "projectType",
          rating,
          comment,
          avatar_url as "avatarUrl",
          created_at as "createdAt",
          verified,
          approved
        FROM comments
        ORDER BY created_at DESC
      `;

      if (rows) {
        const mapped = rows as unknown as ExtendedCommentItem[];
        saveStoredComments(mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Neon DB query error:', err);
    }
    return getStoredComments();
  },

  // Get all approved comments for public view
  getApprovedComments(): ExtendedCommentItem[] {
    const all = getStoredComments();
    return all.filter(c => c.approved === true);
  },

  // Get only pending comments for admin view
  getPendingComments(): ExtendedCommentItem[] {
    const all = getStoredComments();
    return all.filter(c => c.approved === false);
  },

  // Get all comments for admin overview
  getAllComments(): ExtendedCommentItem[] {
    return getStoredComments();
  },

  // Submit a new comment from public form (defaults to approved: false for review)
  async submitComment(formData: CommentFormData): Promise<ExtendedCommentItem> {
    const all = getStoredComments();
    const newComment: ExtendedCommentItem = {
      id: `rev-${Date.now()}`,
      authorName: formData.authorName.trim(),
      authorLastNameInitial: formData.authorLastNameInitial?.trim() || undefined,
      role: formData.role?.trim() || 'Cliente Verificado',
      projectName: formData.projectName.trim(),
      projectType: formData.projectType,
      rating: formData.rating,
      comment: formData.comment.trim(),
      avatarUrl: formData.avatarUrl || undefined,
      createdAt: 'Hace un momento (Pendiente de Aprobación)',
      verified: true,
      approved: false // Requires admin approval!
    };

    const updated = [newComment, ...all];
    saveStoredComments(updated);

    // If Neon connected, insert directly to remote DB
    if (isNeonConfigured && sql) {
      try {
        await sql`
          INSERT INTO comments (id, author_name, author_last_name_initial, role, project_name, project_type, rating, comment, avatar_url, created_at, verified, approved)
          VALUES (${newComment.id}, ${newComment.authorName}, ${newComment.authorLastNameInitial || null}, ${newComment.role || null}, ${newComment.projectName}, ${newComment.projectType}, ${newComment.rating}, ${newComment.comment}, ${newComment.avatarUrl || null}, ${newComment.createdAt}, ${newComment.verified}, ${newComment.approved})
        `;
      } catch (err) {
        console.error('Error inserting to Neon DB:', err);
      }
    }

    return newComment;
  },

  // Approve a pending comment
  async approveComment(id: string): Promise<boolean> {
    const all = getStoredComments();
    const target = all.find(c => c.id === id);
    if (!target) return false;

    target.approved = true;
    target.createdAt = 'Recientemente Aprobado';
    saveStoredComments(all);

    if (isNeonConfigured && sql) {
      try {
        await sql`UPDATE comments SET approved = true, created_at = 'Recientemente Aprobado' WHERE id = ${id}`;
      } catch (err) {
        console.error('Error updating Neon DB:', err);
      }
    }

    return true;
  },

  // Reject / Delete a comment permanently
  async deleteComment(id: string): Promise<boolean> {
    const all = getStoredComments();
    const filtered = all.filter(c => c.id !== id);
    saveStoredComments(filtered);

    if (isNeonConfigured && sql) {
      try {
        await sql`DELETE FROM comments WHERE id = ${id}`;
      } catch (err) {
        console.error('Error deleting from Neon DB:', err);
      }
    }

    return true;
  },

  // Update an existing comment
  async updateComment(id: string, updates: Partial<ExtendedCommentItem>): Promise<boolean> {
    const all = getStoredComments();
    const index = all.findIndex(c => c.id === id);
    if (index === -1) return false;

    all[index] = { ...all[index], ...updates };
    saveStoredComments(all);

    if (isNeonConfigured && sql) {
      try {
        await sql`
          UPDATE comments 
          SET 
            author_name = COALESCE(${updates.authorName ?? null}, author_name),
            role = COALESCE(${updates.role ?? null}, role),
            project_name = COALESCE(${updates.projectName ?? null}, project_name),
            comment = COALESCE(${updates.comment ?? null}, comment),
            rating = COALESCE(${updates.rating ?? null}, rating),
            verified = COALESCE(${updates.verified ?? null}, verified)
          WHERE id = ${id}
        `;
      } catch (err) {
        console.error('Error updating Neon DB:', err);
      }
    }

    return true;
  }
};
