export interface ServiceItem {
  id: string;
  iconName: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  techTags: string[];
  gradientBadge: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'pwa' | 'web' | 'database' | 'dashboard';
  categoryLabel: string;
  tagline?: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  tags: string[];
  accentColor?: string;
  isLive?: boolean;
  statusText?: string;
  highlights?: string[];
}

export interface EstimatorOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDays: number;
  icon: string;
}

export interface EstimatorAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'feature' | 'security' | 'infra';
}

export interface SocialLink {
  name: string;
  url: string;
  platform: 'facebook' | 'tiktok' | 'instagram' | 'whatsapp';
  handle: string;
}

export interface TerminalCommandResponse {
  output: string | string[];
  isError?: boolean;
}

export interface CommentItem {
  id: string;
  authorName: string;
  authorLastNameInitial?: string;
  role?: string;
  avatarUrl?: string;
  projectName: string;
  projectType: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface CommentFormData {
  authorName: string;
  authorLastNameInitial: string;
  role: string;
  projectName: string;
  projectType: string;
  rating: number;
  comment: string;
  avatarUrl: string;
}
