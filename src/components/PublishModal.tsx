import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  MessageSquare,
  Globe,
  Printer,
  Sparkles,
  Download,
} from 'lucide-react';
import { Project, WebsiteContent } from '../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onViewLive: (slug: string) => void;
  onOpenCustomDomain?: (project: Project) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  project,
  onViewLive,
  onOpenCustomDomain,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen || !project) return null;

  const siteSlug = project.slug || 'my-site';
  const siteUrl = `${window.location.origin}/site/${siteSlug}`;
  const cleanWhatsapp = (project.businessInfo.whatsappNumber || '').replace(/[^0-9]/g, '');

  // Generate QR Code URL using standard Google Chart / QR API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(siteUrl)}`;

  function handleCopy() {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleShareWhatsApp() {
    const text = encodeURIComponent(
      `Check out the official website for ${project.businessInfo.businessName}: ${siteUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Globe className="h-7 w-7" />
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            ● Published & Live Online
          </span>
          <h3 className="mt-2 font-heading text-2xl font-bold text-slate-900">
            Your Website Is Live!
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {project.businessInfo.businessName} can now be accessed by customers from anywhere in the world.
          </p>
        </div>

        {/* Shareable Link Box */}
        <div className="mb-6 space-y-2">
          <label className="block text-xs font-bold text-slate-700">Shareable Website Link</label>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-2">
            <span className="flex-1 truncate font-mono text-xs text-slate-800 px-2 select-all">
              {siteUrl}
            </span>
            <button
              id="copy-site-link-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            id="view-live-site-btn"
            onClick={() => {
              onClose();
              onViewLive(siteSlug);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
          >
            <ExternalLink className="h-4 w-4" />
            Open Live Website
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition"
          >
            <MessageSquare className="h-4 w-4 fill-current" />
            Share on WhatsApp
          </button>
        </div>

        {/* Printable QR Code Drawer */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Printable Counter QR Code</span>
            </div>
            <button
              onClick={() => setShowQr(!showQr)}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              {showQr ? 'Hide' : 'Show QR Code'}
            </button>
          </div>

          {showQr && (
            <div className="mt-4 pt-4 border-t border-slate-200 text-center space-y-3 animate-fadeIn">
              <p className="text-[11px] text-slate-500">
                Display this on your billing counter, front door, or visiting cards.
              </p>
              <div className="inline-block rounded-2xl bg-white p-3 border border-slate-200 shadow-sm">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for ${project.businessInfo.businessName}`}
                  className="h-44 w-44 mx-auto object-contain"
                />
              </div>
              <div>
                <a
                  href={qrCodeUrl}
                  target="_blank"
                  download={`qrcode-${siteSlug}.png`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download High-Res Image
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Custom Domain Callout */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 p-3.5 text-xs text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Want your own branded domain?</span>
              <p className="text-[11px] text-slate-500">
                Connect <code>www.yourbrand.com</code> with instant CNAME setup & free SSL.
              </p>
            </div>
          </div>
          {onOpenCustomDomain && (
            <button
              onClick={() => {
                onClose();
                onOpenCustomDomain(project);
              }}
              className="shrink-0 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs transition active:scale-95"
            >
              Setup Domain →
            </button>
          )}
        </div>

        {/* Tips for getting customers */}
        <div className="mt-6 border-t border-slate-100 pt-4 text-left">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
            Where to paste your new link:
          </p>
          <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
            <li>Google Business Profile (Website link button)</li>
            <li>Instagram bio & Facebook Page About section</li>
            <li>WhatsApp Business catalog and automatic greeting message</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
