import React, { useState, useEffect } from 'react';
import {
  Plus,
  Globe,
  Edit3,
  Eye,
  Trash2,
  Share2,
  ExternalLink,
  MessageSquare,
  Phone,
  BarChart3,
  Clock,
  MapPin,
  Sparkles,
  Inbox,
  User as UserIcon,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  Settings,
} from 'lucide-react';
import { Project, User, LeadInquiry } from '../types';
import { getProjects, deleteProject, updateProject, getProject } from '../lib/api';
import { ProjectSettingsModal } from './ProjectSettingsModal';

interface DashboardProps {
  user: User;
  onCreateNew: () => void;
  onEditProject: (project: Project) => void;
  onPreviewProject: (project: Project) => void;
  onPublishProject: (project: Project) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onCreateNew,
  onEditProject,
  onPreviewProject,
  onPublishProject,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Leads modal or drawer
  const [selectedProjectForLeads, setSelectedProjectForLeads] = useState<Project | null>(null);
  const [selectedProjectForSettings, setSelectedProjectForSettings] = useState<Project | null>(null);
  const [projectLeads, setProjectLeads] = useState<LeadInquiry[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Could not load your projects');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Are you sure you want to delete "${project.businessInfo.businessName}"?`)) {
      return;
    }
    try {
      await deleteProject(project.id);
      setProjects(projects.filter((p) => p.id !== project.id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  }

  async function handleTogglePublish(project: Project) {
    try {
      const updated = await updateProject(project.id, { isPublished: !project.isPublished });
      setProjects(projects.map((p) => (p.id === project.id ? updated : p)));
      if (!project.isPublished) {
        onPublishProject(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update publishing status');
    }
  }

  async function handleOpenLeads(project: Project) {
    setSelectedProjectForLeads(project);
    setLoadingLeads(true);
    try {
      const data = await getProject(project.id);
      setProjectLeads(data.inquiries || []);
    } catch {
      setProjectLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  }

  function handleCopyLink(slug: string) {
    const url = `${window.location.origin}/site/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-slate-200 gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome back, {user.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your AI-generated business websites, leads, and visitor analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-create-btn"
            onClick={onCreateNew}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition"
          >
            <Plus className="h-4 w-4" />
            Create New Website
          </button>
        </div>
      </div>

      {/* Aggregate Stats Overview */}
      {projects.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Total Websites</span>
            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
              {projects.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Published Sites</span>
            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1">
              {projects.filter((p) => p.isPublished).length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">WhatsApp Taps</span>
            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-indigo-600 mt-1">
              {projects.reduce((sum, p) => sum + (p.whatsappClicks || 0), 0)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Direct Calls</span>
            <p className="font-heading font-extrabold text-2xl sm:text-3xl text-blue-600 mt-1">
              {projects.reduce((sum, p) => sum + (p.callClicks || 0), 0)}
            </p>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg text-slate-900">Your Websites</h3>
          <span className="text-xs text-slate-500">{projects.length} project(s)</span>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-xs text-slate-500">Loading your websites...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-700">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="max-w-sm mx-auto">
              <h4 className="font-heading font-bold text-lg text-slate-900">No websites created yet</h4>
              <p className="mt-1 text-xs text-slate-500">
                You haven't generated a website yet. Tell LocalAI Web your business details and get a live site in 2 minutes!
              </p>
            </div>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              <Plus className="h-4 w-4" />
              Create My First Website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Status Banner */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        project.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          project.isPublished ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {project.isPublished ? 'Published & Live' : 'Draft'}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Business Details */}
                  <div className="mb-4">
                    <h4 className="font-heading font-extrabold text-lg text-slate-900 line-clamp-1">
                      {project.businessInfo.businessName}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {project.businessInfo.city} · {project.businessInfo.category}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                      {project.businessInfo.shortDescription || project.website.hero.subheadline}
                    </p>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Views</span>
                      <p className="font-bold text-slate-800">{project.viewsCount || 0}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">WhatsApp</span>
                      <p className="font-bold text-emerald-600">{project.whatsappClicks || 0}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Calls</span>
                      <p className="font-bold text-blue-600">{project.callClicks || 0}</p>
                    </div>
                  </div>

                  {/* Custom Domain Pill or Setup Banner */}
                  {project.customDomain?.domain ? (
                    <div className="mb-3 flex items-center justify-between rounded-xl bg-indigo-50/70 border border-indigo-100 px-3 py-2 text-xs">
                      <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                        <Globe className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <span className="font-bold text-[11px] text-slate-800 truncate" title={project.customDomain.domain}>
                          {project.customDomain.domain}
                        </span>
                      </div>
                      <button
                        id={`domain-badge-${project.id}`}
                        onClick={() => setSelectedProjectForSettings(project)}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition flex items-center gap-1 shrink-0 ${
                          project.customDomain.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : project.customDomain.status === 'error'
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            project.customDomain.status === 'active'
                              ? 'bg-emerald-500'
                              : project.customDomain.status === 'error'
                              ? 'bg-rose-500'
                              : 'bg-amber-500 animate-pulse'
                          }`}
                        />
                        {project.customDomain.status === 'active'
                          ? 'Active CNAME'
                          : project.customDomain.status === 'error'
                          ? 'DNS Error'
                          : 'Pending DNS'}
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`connect-domain-btn-${project.id}`}
                      onClick={() => setSelectedProjectForSettings(project)}
                      className="mb-3 flex w-full items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs text-slate-500 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 transition"
                    >
                      <span className="flex items-center gap-1.5 text-[11px] font-medium">
                        <Globe className="h-3 w-3 text-slate-400" />
                        Connect Custom Domain
                      </span>
                      <span className="text-[10px] font-bold text-indigo-600">Setup CNAME →</span>
                    </button>
                  )}

                  {/* Shareable Link Box if Published */}
                  {project.isPublished && (
                    <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-2 text-xs border border-slate-200">
                      <span className="font-mono text-[11px] text-slate-700 truncate max-w-[180px]">
                        /site/{project.slug}
                      </span>
                      <button
                        onClick={() => handleCopyLink(project.slug)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        {copiedSlug === project.slug ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onPreviewProject(project)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      Preview
                    </button>

                    <button
                      onClick={() => onEditProject(project)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-indigo-50 border border-indigo-200 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      id={`project-settings-${project.id}`}
                      onClick={() => setSelectedProjectForSettings(project)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      title="Custom Domain & Settings"
                    >
                      <Settings className="h-3.5 w-3.5 text-slate-400" />
                      Settings
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => handleOpenLeads(project)}
                      className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <Inbox className="h-3.5 w-3.5" />
                      View Leads
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className={`font-bold transition ${
                          project.isPublished
                            ? 'text-amber-600 hover:text-amber-700'
                            : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        {project.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => handleDelete(project)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Delete Website"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Settings & Custom Domain Modal */}
      <ProjectSettingsModal
        isOpen={!!selectedProjectForSettings}
        project={selectedProjectForSettings}
        onClose={() => setSelectedProjectForSettings(null)}
        onProjectUpdated={(updatedProject) => {
          setProjects((prev) =>
            prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
          );
          setSelectedProjectForSettings(updatedProject);
        }}
      />

      {/* Leads Drawer / Modal */}
      {selectedProjectForLeads && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-900">
                  Customer Leads & Bookings
                </h3>
                <p className="text-xs text-slate-500">
                  Inquiries submitted via {selectedProjectForLeads.businessInfo.businessName}
                </p>
              </div>
              <button
                onClick={() => setSelectedProjectForLeads(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingLeads ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading inquiries...</div>
              ) : projectLeads.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">No leads submitted yet</p>
                  <p className="text-[11px] text-slate-400">
                    When visitors fill out the booking form on your website, they will appear here.
                  </p>
                </div>
              ) : (
                projectLeads.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{inquiry.name}</span>
                        {inquiry.serviceRequested && (
                          <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                            {inquiry.serviceRequested}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <a
                        href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        WhatsApp: {inquiry.phone}
                      </a>
                      <a
                        href={`tel:${inquiry.phone.replace(/[^0-9]/g, '')}`}
                        className="flex items-center gap-1 text-blue-700 font-bold hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Call: {inquiry.phone}
                      </a>
                      {inquiry.email && (
                        <span className="text-slate-500">Email: {inquiry.email}</span>
                      )}
                    </div>

                    {inquiry.message && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80 mt-1">
                        "{inquiry.message}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
