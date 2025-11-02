import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Heart, BookOpen, FileText, Calendar, Package, Dice6, BookMarked } from 'lucide-react';
import Layout from '../components/Layout';

const Home = () => {
  const quickLinks = [
    { to: '/punitions', label: 'Punitions', icon: AlertCircle, color: 'text-red-400' },
    { to: '/orgasmes', label: 'Orgasmes', icon: Heart, color: 'text-pink-400' },
    { to: '/carnet', label: 'Carnet Intime', icon: BookOpen, color: 'text-blue-400' },
    { to: '/histoires', label: 'Histoires', icon: FileText, color: 'text-purple-400' },
    { to: '/seances', label: 'Séances', icon: Calendar, color: 'text-indigo-400' },
    { to: '/inventaire', label: 'Inventaire', icon: Package, color: 'text-yellow-400' },
    { to: '/idees', label: 'Idées', icon: AlertCircle, color: 'text-amber-400' },
    { to: '/de10', label: 'Dé 10', icon: Dice6, color: 'text-green-400' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-serif text-white mb-2">Bienvenue</h1>
          <p className="text-slate-400">Votre espace de suivi BDSM entre Mae et Eliot</p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-6 hover:border-slate-600 transition-all hover:shadow-lg group"
              >
                <Icon className={`w-8 h-8 ${link.color} mb-3 group-hover:scale-110 transition-transform`} />
                <h3 className="text-lg font-semibold text-slate-100">{link.label}</h3>
              </Link>
            );
          })}
        </div>

        {/* About Section */}
        <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-6 lg:p-8">
          <h2 className="text-xl font-serif text-white mb-4">À propos</h2>
          <p className="text-slate-400 mb-4">
            Cette plateforme vous permet de suivre et documenter tous les aspects de votre relation BDSM.
          </p>
          <p className="text-slate-400">
            Utilisez le menu latéral pour naviguer entre les différentes sections.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;