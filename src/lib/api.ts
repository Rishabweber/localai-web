import { BusinessInfo, WebsiteContent, Project, User, LeadInquiry } from '../types';

const TOKEN_KEY = 'localai_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// Auth API
export async function signup(payload: { email: string; password: string; name: string; businessName?: string }) {
  const data = await apiRequest<{ user: User; token: string }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setStoredToken(data.token);
  return data.user;
}

export async function login(payload: { email: string; password: string }) {
  const data = await apiRequest<{ user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setStoredToken(data.token);
  return data.user;
}

export async function loginGuest() {
  const data = await apiRequest<{ user: User; token: string }>('/api/auth/guest', {
    method: 'POST',
  });
  setStoredToken(data.token);
  return data.user;
}

export async function getMe(): Promise<User | null> {
  try {
    const data = await apiRequest<{ user: User }>('/api/auth/me');
    return data.user;
  } catch {
    clearStoredToken();
    return null;
  }
}

// AI API
export async function generateWebsite(businessInfo: BusinessInfo): Promise<WebsiteContent> {
  const data = await apiRequest<{ success: boolean; website: WebsiteContent }>('/api/ai/generate-website', {
    method: 'POST',
    body: JSON.stringify({ businessInfo }),
  });
  return data.website;
}

export async function regenerateSection(
  section: 'hero' | 'about' | 'services' | 'faq' | 'seo',
  businessInfo: BusinessInfo,
  currentContent: WebsiteContent,
  tone?: string
): Promise<Partial<WebsiteContent>> {
  const data = await apiRequest<{ success: boolean; updatedSection: Partial<WebsiteContent> }>(
    '/api/ai/regenerate-section',
    {
      method: 'POST',
      body: JSON.stringify({ section, businessInfo, currentContent, tone }),
    }
  );
  return data.updatedSection;
}

// Projects API
export async function getProjects(): Promise<Project[]> {
  const data = await apiRequest<{ projects: Project[] }>('/api/projects');
  return data.projects;
}

export async function getProject(id: string): Promise<{ project: Project; inquiries: LeadInquiry[] }> {
  return await apiRequest<{ project: Project; inquiries: LeadInquiry[] }>(`/api/projects/${id}`);
}

export async function saveProject(businessInfo: BusinessInfo, website: WebsiteContent): Promise<Project> {
  const data = await apiRequest<{ project: Project }>('/api/projects', {
    method: 'POST',
    body: JSON.stringify({ businessInfo, website }),
  });
  return data.project;
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<Project, 'businessInfo' | 'website' | 'isPublished' | 'slug' | 'customDomain'>>
): Promise<Project> {
  const data = await apiRequest<{ project: Project }>(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.project;
}

export async function configureCustomDomain(
  projectId: string,
  domain: string
): Promise<{ project: Project; customDomain: any }> {
  return await apiRequest<{ project: Project; customDomain: any }>(
    `/api/projects/${projectId}/custom-domain`,
    {
      method: 'POST',
      body: JSON.stringify({ domain }),
    }
  );
}

export async function verifyCustomDomain(
  projectId: string,
  forceVerify: boolean = false
): Promise<{
  success: boolean;
  verified: boolean;
  detectedRecords?: string[];
  errorMessage?: string;
  customDomain: any;
  project: Project;
}> {
  return await apiRequest<{
    success: boolean;
    verified: boolean;
    detectedRecords?: string[];
    errorMessage?: string;
    customDomain: any;
    project: Project;
  }>(`/api/projects/${projectId}/verify-domain`, {
    method: 'POST',
    body: JSON.stringify({ forceVerify }),
  });
}

export async function removeCustomDomain(projectId: string): Promise<{ success: boolean; project: Project }> {
  return await apiRequest<{ success: boolean; project: Project }>(
    `/api/projects/${projectId}/custom-domain`,
    {
      method: 'DELETE',
    }
  );
}

export async function deleteProject(id: string): Promise<boolean> {
  const data = await apiRequest<{ success: boolean }>(`/api/projects/${id}`, {
    method: 'DELETE',
  });
  return data.success;
}

// Public Website API
export async function getPublicSite(slug: string): Promise<{
  slug: string;
  businessInfo: BusinessInfo;
  website: WebsiteContent;
  publishedAt?: string;
}> {
  return await apiRequest<{
    slug: string;
    businessInfo: BusinessInfo;
    website: WebsiteContent;
    publishedAt?: string;
  }>(`/api/public/site/${slug}`);
}

export async function submitSiteInquiry(
  slug: string,
  inquiry: { name: string; phone: string; email?: string; serviceRequested?: string; message: string }
): Promise<LeadInquiry> {
  const data = await apiRequest<{ success: boolean; inquiry: LeadInquiry }>(`/api/public/site/${slug}/inquiry`, {
    method: 'POST',
    body: JSON.stringify(inquiry),
  });
  return data.inquiry;
}

export async function trackPublicAnalytics(slug: string, type: 'whatsapp' | 'call') {
  try {
    await fetch(`/api/public/site/${slug}/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
  } catch {
    // silent analytics failover
  }
}
