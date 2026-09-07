import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  Check,
  Copy,
  AlertCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Server,
  ArrowRight,
  Sparkles,
  Link2,
} from 'lucide-react';
import { Project, CustomDomainConfig } from '../types';
import {
  configureCustomDomain,
  verifyCustomDomain,
  removeCustomDomain,
  updateProject,
} from '../lib/api';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onProjectUpdated: (updatedProject: Project) => void;
}

type TabType = 'domain' | 'slug';

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('domain');

  // Custom domain form state
  const [domainInput, setDomainInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    detectedRecords?: string[];
  }>({ status: 'idle', message: '' });

  // Slug form state
  const [slugInput, setSlugInput] = useState('');
  const [isSavingSlug, setIsSavingSlug] = useState(false);
  const [slugFeedback, setSlugFeedback] = useState<string | null>(null);

  // Copy state
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);

  // Registrar guide accordion
  const [selectedRegistrar, setSelectedRegistrar] = useState<string | null>('godaddy');
  const [showRegistrarHelp, setShowRegistrarHelp] = useState(false);

  useEffect(() => {
    if (project) {
      setDomainInput(project.customDomain?.domain || '');
      setSlugInput(project.slug || '');
      setVerificationFeedback({ status: 'idle', message: '' });
      setSlugFeedback(null);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const currentDomain = project.customDomain;
  const cnameTarget = currentDomain?.cnameTarget || 'cname.localai.web';
  const cnameHost = currentDomain?.dnsHost || 'www';

  const isConfigured = !!currentDomain?.domain;
  const isVerified = currentDomain?.status === 'active' || currentDomain?.status === 'verified';

  async function handleSaveDomain(e: React.FormEvent) {
    e.preventDefault();
    if (!project) return;

    const cleaned = domainInput
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '');

    if (!cleaned) {
      setVerificationFeedback({
        status: 'error',
        message: 'Please enter a domain name (e.g. www.yourbusiness.com).',
      });
      return;
    }

    setIsSaving(true);
    setVerificationFeedback({ status: 'idle', message: '' });

    try {
      const res = await configureCustomDomain(project.id, cleaned);
      onProjectUpdated(res.project);
      setVerificationFeedback({
        status: 'idle',
        message: 'Domain saved. Configure your DNS CNAME record below, then click "Verify DNS Connection".',
      });
    } catch (err: any) {
      setVerificationFeedback({
        status: 'error',
        message: err.message || 'Failed to configure custom domain.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleVerify(simulate: boolean = false) {
    if (!project) return;
    setIsVerifying(true);
    setVerificationFeedback({ status: 'idle', message: '' });

    try {
      const res = await verifyCustomDomain(project.id, simulate);
      onProjectUpdated(res.project);

      if (res.verified) {
        setVerificationFeedback({
          status: 'success',
          message:
            'CNAME record verified successfully! SSL certificate is active. Your website is now live on your custom domain.',
          detectedRecords: res.detectedRecords,
        });
      } else {
        setVerificationFeedback({
          status: 'error',
          message:
            res.errorMessage ||
            'DNS record not detected yet. DNS changes can take a few minutes to propagate across servers.',
          detectedRecords: res.detectedRecords,
        });
      }
    } catch (err: any) {
      setVerificationFeedback({
        status: 'error',
        message: err.message || 'Verification check failed.',
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleRemoveDomain() {
    if (!project) return;
    if (!window.confirm(`Disconnect custom domain "${currentDomain?.domain}" from this website?`)) {
      return;
    }

    try {
      const res = await removeCustomDomain(project.id);
      onProjectUpdated(res.project);
      setDomainInput('');
      setVerificationFeedback({ status: 'idle', message: 'Domain disconnected.' });
    } catch (err: any) {
      alert(err.message || 'Failed to remove domain');
    }
  }

  async function handleSaveSlug(e: React.FormEvent) {
    e.preventDefault();
    if (!project) return;

    setIsSavingSlug(true);
    setSlugFeedback(null);

    const sanitized = slugInput
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)/g, '');

    try {
      const updated = await updateProject(project.id, { slug: sanitized });
      onProjectUpdated(updated);
      setSlugFeedback('URL slug updated successfully!');
      setTimeout(() => setSlugFeedback(null), 3000);
    } catch (err: any) {
      setSlugFeedback(err.message || 'Failed to update URL slug');
    } finally {
      setIsSavingSlug(false);
    }
  }

  function handleCopy(text: string, type: 'target' | 'host') {
    navigator.clipboard.writeText(text);
    if (type === 'target') {
      setCopiedTarget(true);
      setTimeout(() => setCopiedTarget(false), 2000);
    } else {
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900">
                Project Settings
              </h2>
              <p className="text-xs text-slate-500">
                {project.businessInfo.businessName} · Domain & URL Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 sm:px-8 pt-2">
          <button
            onClick={() => setActiveTab('domain')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition ${
              activeTab === 'domain'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Custom Domain</span>
            {isVerified ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Active
              </span>
            ) : isConfigured ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                Pending DNS
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('slug')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition ${
              activeTab === 'slug'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="h-4 w-4" />
            <span>LocalAI Web URL & Slug</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {activeTab === 'domain' && (
            <div className="space-y-6">
              {/* Introduction Banner */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-indigo-950">
                      Connect Your Branded Custom Domain
                    </h3>
                    <p className="mt-1 text-xs text-indigo-800/80 leading-relaxed">
                      Replace your temporary link (e.g. <code>localai.web/site/{project.slug}</code>) with your own domain name like <code>www.yourbusiness.com</code>. We provide automatic free SSL encryption and fast global routing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Header */}
              {isConfigured && (
                <div
                  className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                    isVerified
                      ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
                      : currentDomain?.status === 'error'
                      ? 'border-rose-200 bg-rose-50/70 text-rose-900'
                      : 'border-amber-200 bg-amber-50/70 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        isVerified
                          ? 'bg-emerald-600 text-white'
                          : currentDomain?.status === 'error'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {isVerified ? (
                        <ShieldCheck className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-sm">
                          {currentDomain.domain}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isVerified
                              ? 'bg-emerald-200/70 text-emerald-800'
                              : currentDomain?.status === 'error'
                              ? 'bg-rose-200/70 text-rose-800'
                              : 'bg-amber-200/70 text-amber-800'
                          }`}
                        >
                          {isVerified
                            ? '● Live & SSL Active'
                            : currentDomain?.status === 'error'
                            ? '● CNAME Missing or Unpropagated'
                            : '● Pending DNS Propagation'}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-80 mt-0.5">
                        {isVerified
                          ? 'Visitors are successfully routed to your website with active HTTPS.'
                          : 'Point your DNS CNAME record to cname.localai.web to complete activation.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isVerified && (
                      <a
                        href={`https://${currentDomain.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100/50 shadow-2xs transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Visit Live
                      </a>
                    )}
                    <button
                      onClick={handleRemoveDomain}
                      className="inline-flex items-center gap-1 rounded-xl bg-white/80 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
                      title="Disconnect Domain"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}

              {/* Enter / Change Domain Form */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <label className="block text-xs font-bold text-slate-900">
                  {isConfigured ? 'Change Connected Domain' : 'Enter Your Custom Domain'}
                </label>
                <form onSubmit={handleSaveDomain} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-medium text-slate-400 select-none">
                      https://
                    </span>
                    <input
                      id="custom-domain-input"
                      type="text"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="www.yourbusiness.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-20 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <button
                    id="save-domain-btn"
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 disabled:opacity-60 transition shrink-0"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>Save Domain</>
                    )}
                  </button>
                </form>
                <p className="text-[11px] text-slate-400">
                  Tip: Most local businesses prefer using <code>www.yourbrand.com</code> or a subdomain like <code>salon.yourbrand.com</code>.
                </p>
              </div>

              {/* DNS CNAME Configuration Instructions */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                      DNS
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">
                        DNS CNAME Configuration Instructions
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Follow these simple steps in your domain registrar's DNS manager (GoDaddy, Namecheap, Google Domains, Cloudflare, etc.).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 1 */}
                <div className="flex items-start gap-3 text-xs">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 font-bold text-[10px] text-slate-700">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-slate-800">
                      Sign in to your domain provider's DNS management console.
                    </span>
                    <p className="text-slate-500 mt-0.5">
                      Locate the DNS Records, Zone Editor, or Manage DNS section for your domain.
                    </p>
                  </div>
                </div>

                {/* Step 2 with DNS Table */}
                <div className="flex items-start gap-3 text-xs">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 font-bold text-[10px] text-slate-700">
                    2
                  </span>
                  <div className="flex-1 space-y-2">
                    <span className="font-bold text-slate-800">
                      Add or update a CNAME record with the following values:
                    </span>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-2.5 px-4">Record Type</th>
                            <th className="py-2.5 px-4">Name / Host</th>
                            <th className="py-2.5 px-4">Points To / Target</th>
                            <th className="py-2.5 px-4">TTL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-xs">
                          <tr>
                            <td className="py-3 px-4 font-bold text-indigo-600">CNAME</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800">
                                  {cnameHost}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(cnameHost, 'host')}
                                  className="text-slate-400 hover:text-indigo-600"
                                  title="Copy Host"
                                >
                                  {copiedHost ? (
                                    <Check className="h-3 w-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 bg-indigo-50/70 text-indigo-900 px-2 py-0.5 rounded-md border border-indigo-100">
                                  {cnameTarget}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(cnameTarget, 'target')}
                                  className="rounded p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                                  title="Copy CNAME Target"
                                >
                                  {copiedTarget ? (
                                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-sans font-bold">
                                      <Check className="h-3 w-3" /> Copied
                                    </span>
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-sans">
                              Automatic / 3600 (1 Hour)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Apex domain forwarding advice */}
                    <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3 text-[11px] text-amber-900 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <span className="font-bold">Using a root domain (without 'www')?</span>
                        <p className="text-amber-800/90 mt-0.5">
                          Standard DNS protocol does not allow CNAME on the root apex domain (<code>@</code>). In your registrar settings, set up a simple <strong>Domain Forwarding / 301 Redirect</strong> from <code>yourbusiness.com</code> to <code>https://www.yourbusiness.com</code>, or use Cloudflare's free CNAME Flattening.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 text-xs">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 font-bold text-[10px] text-slate-700">
                    3
                  </span>
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="font-bold text-slate-800">
                        Verify your DNS configuration
                      </span>
                      <p className="text-slate-500 mt-0.5">
                        Once you add the record, click below to verify connectivity. We'll automatically provision and issue a free SSL certificate.
                      </p>
                    </div>

                    {/* Verification Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        id="verify-dns-btn"
                        type="button"
                        onClick={() => handleVerify(false)}
                        disabled={isVerifying || !isConfigured}
                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition shadow-xs"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                        Verify DNS Connection
                      </button>

                      {/* Demo simulation button */}
                      <button
                        id="simulate-verify-btn"
                        type="button"
                        onClick={() => handleVerify(true)}
                        disabled={isVerifying || !isConfigured}
                        className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 active:scale-95 disabled:opacity-50 transition"
                        title="Simulates immediate DNS verification for testing & demonstration"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                        Simulate Instant Activation (Demo Mode)
                      </button>

                      {isConfigured && currentDomain?.domain && (
                        <a
                          href={`https://dnschecker.org/#CNAME/${currentDomain.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition"
                        >
                          Check Global Propagation
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    {/* Feedback box */}
                    {verificationFeedback.message && (
                      <div
                        className={`rounded-xl p-3.5 text-xs border flex items-start gap-2.5 animate-fadeIn ${
                          verificationFeedback.status === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : verificationFeedback.status === 'error'
                            ? 'bg-rose-50 border-rose-200 text-rose-800'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                        }`}
                      >
                        {verificationFeedback.status === 'success' ? (
                          <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        ) : verificationFeedback.status === 'error' ? (
                          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                        ) : (
                          <HelpCircle className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                        )}
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{verificationFeedback.message}</p>
                          {verificationFeedback.detectedRecords && verificationFeedback.detectedRecords.length > 0 && (
                            <p className="font-mono text-[10px] opacity-80">
                              Detected CNAME: {verificationFeedback.detectedRecords.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Registrar Specific Instructions Drawer */}
                <div className="pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setShowRegistrarHelp(!showRegistrarHelp)}
                    className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-indigo-600 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
                      Step-by-step guides for popular domain registrars
                    </span>
                    {showRegistrarHelp ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {showRegistrarHelp && (
                    <div className="mt-3 space-y-3 pt-3 border-t border-slate-200 text-xs animate-fadeIn">
                      <div className="flex flex-wrap gap-2">
                        {['godaddy', 'namecheap', 'cloudflare', 'hostinger', 'squarespace'].map((reg) => (
                          <button
                            key={reg}
                            type="button"
                            onClick={() => setSelectedRegistrar(reg)}
                            className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition ${
                              selectedRegistrar === reg
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {reg === 'squarespace' ? 'Google / Squarespace' : reg}
                          </button>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs space-y-2 text-slate-600">
                        {selectedRegistrar === 'godaddy' && (
                          <ol className="list-decimal list-inside space-y-1.5">
                            <li>Log in to your <strong>GoDaddy Domain Portfolio</strong>.</li>
                            <li>Click the domain you want to connect and select <strong>Manage DNS</strong>.</li>
                            <li>In the <strong>DNS Records</strong> section, click <strong>Add New Record</strong>.</li>
                            <li>Choose Type: <strong>CNAME</strong>, Name: <strong>www</strong>, Value: <strong>cname.localai.web</strong>, TTL: <strong>1/2 Hour</strong>.</li>
                            <li>Save the record. To redirect the root domain, scroll down to <strong>Forwarding</strong> and point <code>yourdomain.com</code> to <code>https://www.yourdomain.com</code>.</li>
                          </ol>
                        )}
                        {selectedRegistrar === 'namecheap' && (
                          <ol className="list-decimal list-inside space-y-1.5">
                            <li>Log in to <strong>Namecheap</strong> and go to <strong>Domain List</strong>.</li>
                            <li>Click <strong>Manage</strong> next to your domain, then open the <strong>Advanced DNS</strong> tab.</li>
                            <li>Under <strong>Host Records</strong>, click <strong>Add New Record</strong>.</li>
                            <li>Select <strong>CNAME Record</strong>, enter Host: <strong>www</strong>, Target: <strong>cname.localai.web</strong>, and TTL: <strong>Automatic</strong>.</li>
                            <li>Click the green checkmark to save.</li>
                          </ol>
                        )}
                        {selectedRegistrar === 'cloudflare' && (
                          <ol className="list-decimal list-inside space-y-1.5">
                            <li>Log in to Cloudflare and select your domain.</li>
                            <li>Navigate to <strong>DNS &gt; Records</strong> and click <strong>Add record</strong>.</li>
                            <li>Type: <strong>CNAME</strong>, Name: <strong>www</strong> (or <code>@</code> if using CNAME Flattening).</li>
                            <li>Target: <strong>cname.localai.web</strong>.</li>
                            <li>Proxy status: Can be <strong>DNS only</strong> or <strong>Proxied</strong>. Save the record.</li>
                          </ol>
                        )}
                        {selectedRegistrar === 'hostinger' && (
                          <ol className="list-decimal list-inside space-y-1.5">
                            <li>Access your <strong>Hostinger hPanel</strong> and click <strong>Domains</strong>.</li>
                            <li>Select your domain and go to <strong>DNS / Nameservers</strong>.</li>
                            <li>Under <strong>Manage DNS records</strong>, choose Type: <strong>CNAME</strong>.</li>
                            <li>Enter Name: <strong>www</strong>, Points to: <strong>cname.localai.web</strong>, TTL: <strong>14400</strong>.</li>
                            <li>Click <strong>Add Record</strong>.</li>
                          </ol>
                        )}
                        {selectedRegistrar === 'squarespace' && (
                          <ol className="list-decimal list-inside space-y-1.5">
                            <li>Go to your <strong>Squarespace / Google Domains</strong> dashboard.</li>
                            <li>Click your domain and navigate to <strong>DNS Settings &gt; Custom Records</strong>.</li>
                            <li>Click <strong>Add Record</strong> and choose <strong>CNAME</strong>.</li>
                            <li>Host: <strong>www</strong>, Data: <strong>cname.localai.web</strong>.</li>
                            <li>Save changes.</li>
                          </ol>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'slug' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-sm text-slate-900">
                    LocalAI Web Shareable URL Slug
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize the public URL slug provided by LocalAI Web for your business.
                  </p>
                </div>

                <form onSubmit={handleSaveSlug} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Website URL Slug</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-medium text-slate-400 select-none">
                        localai.web/site/
                      </span>
                      <input
                        type="text"
                        value={slugInput}
                        onChange={(e) => setSlugInput(e.target.value)}
                        placeholder="my-business-name"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-36 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSavingSlug}
                      className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-60 transition shrink-0"
                    >
                      {isSavingSlug ? 'Updating...' : 'Update Slug'}
                    </button>
                  </div>
                  {slugFeedback && (
                    <p className="text-xs font-semibold text-emerald-600">{slugFeedback}</p>
                  )}
                </form>

                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Current Public Link:</span>
                  <a
                    href={`/site/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    {window.location.origin}/site/{project.slug}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-8 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Changes are saved automatically to your project.
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-white border border-slate-200 px-5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
