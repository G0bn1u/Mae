import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, AlertCircle, Heart, BookOpen, FileText, Link as LinkIcon, Calendar, Package, FolderOpen, Lightbulb, Dice6, BookMarked, LogOut, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Accueil', icon: Home },
    { path: '/punitions', label: 'Punitions', icon: AlertCircle },
    { path: '/orgasmes', label: 'Orgasmes', icon: Heart },
    { path: '/carnet', label: 'Carnet Intime', icon: BookOpen },
    { path: '/histoires', label: 'Histoires', icon: FileText },
    { path: '/liens', label: 'Liens Utiles', icon: LinkIcon },
    { path: '/seances', label: 'Séances', icon: Calendar },
    { path: '/inventaire', label: 'Inventaire', icon: Package },
    { path: '/documents', label: 'Documents', icon: FolderOpen },
    { path: '/idees', label: 'Idées', icon: Lightbulb },
    { path: '/de10', label: 'Dé 10', icon: Dice6 },
    { path: '/rituels', label: 'Rituels', icon: BookMarked },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#1e3a4f] to-[#1e4d5f]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0f172a]/60 backdrop-blur-md border-b border-slate-700/50 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-serif text-white">Mae & Eliot</h1>
          <p className="text-xs text-slate-400">Espace privé</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-[#0f172a] w-64 h-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8">
              <h1 className="text-xl font-serif text-white">Mae & Eliot</h1>
              <p className="text-xs text-slate-400">Espace privé</p>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-8 pt-8 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors w-full px-3 py-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 min-h-screen bg-[#0f172a]/60 backdrop-blur-md border-r border-slate-700/50">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-xl font-serif text-white">Mae & Eliot</h1>
              <p className="text-xs text-slate-400">Espace privé</p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors w-full px-3 py-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;