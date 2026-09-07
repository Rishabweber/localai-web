import React, { useState } from 'react';
import { Sparkles, Globe, User as UserIcon, LogOut, Menu, X, ArrowRight, LayoutDashboard, Plus } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate: (view: 'landing' | 'wizard' | 'dashboard') => void;
  currentView: 'landing' | 'wizard' | 'dashboard' | 'editor' | 'preview';
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onNavigate,
  currentView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Official Brand Logo */}
        <button
          type="button"
          id="brand-logo-btn"
          onClick={() => onNavigate('landing')}
          className="flex cursor-pointer items-center text-left transition-opacity hover:opacity-90 focus:outline-none"
          aria-label="LocalWeb AI Studio Home"
        >
          <img
            id="site-official-logo"
            src="/logo-horizontal.svg"
            alt="LocalWeb AI Studio"
            className="h-9 sm:h-10 w-auto max-w-[220px] sm:max-w-[270px] object-contain shrink-0"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            id="nav-how-it-works"
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-indigo-600 transition"
          >
            How It Works
          </button>
          <button
            id="nav-features"
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-indigo-600 transition"
          >
            Features
          </button>
          <button
            id="nav-showcase"
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-indigo-600 transition"
          >
            Showcase
          </button>
          <button
            id="nav-pricing"
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-indigo-600 transition"
          >
            Pricing
          </button>
          <button
            id="nav-faq"
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-indigo-600 transition"
          >
            FAQ
          </button>
          <button
            id="nav-about-founder"
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('about-founder')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-indigo-600 transition whitespace-nowrap"
          >
            About Founder
          </button>
        </nav>

        {/* Right CTA / User Area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                id="navbar-dashboard-btn"
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  currentView === 'dashboard'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-indigo-600" />
                My Websites
              </button>

              <div className="relative">
                <button
                  id="user-profile-menu-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/50 z-50">
                    <div className="border-b border-slate-100 px-3 py-2 text-xs">
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="truncate text-slate-500">{user.email}</p>
                    </div>
                    <button
                      id="dropdown-dashboard-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </button>
                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              <button
                id="navbar-create-btn"
                onClick={() => onNavigate('wizard')}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-300 hover:bg-indigo-700 active:scale-95 transition"
              >
                <Plus className="h-4 w-4" />
                New Website
              </button>
            </>
          ) : (
            <>
              <button
                id="navbar-signin-btn"
                onClick={onOpenAuth}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Sign In
              </button>
              <button
                id="navbar-cta-create"
                onClick={() => onNavigate('wizard')}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-300 hover:bg-indigo-700 active:scale-95 transition"
              >
                Create My Website
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <button
              id="mobile-nav-dashboard"
              onClick={() => onNavigate('dashboard')}
              className="rounded-lg bg-indigo-50 p-2 text-indigo-700"
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
          ) : (
            <button
              id="mobile-nav-auth"
              onClick={onOpenAuth}
              className="text-xs font-semibold text-indigo-600 px-2.5 py-1.5 border border-indigo-200 rounded-lg"
            >
              Sign In
            </button>
          )}

          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('landing');
              }}
              className="text-left font-medium text-slate-700 py-2"
            >
              Home
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left font-medium text-slate-700 py-2"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left font-medium text-slate-700 py-2"
            >
              Live Previews
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left font-medium text-slate-700 py-2"
            >
              Pricing
            </button>
            <button
              id="mobile-nav-about-founder"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('about-founder')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left font-medium text-slate-700 py-2"
            >
              About Founder
            </button>
            {user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="text-left font-medium text-indigo-600 py-2 flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                My Websites Dashboard
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('wizard');
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              Create My Website
            </button>
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign In to Existing Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
