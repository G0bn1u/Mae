import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Incorrect email or password',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Incorrect email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#1e3a4f] to-[#1e4d5f] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">Connexion</h1>
            <p className="text-slate-400 text-sm">Accédez à votre espace privé</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#1e293b] border-slate-600 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#1e293b] border-slate-600 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500 h-12"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-md transition-colors"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-slate-300 hover:text-white transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;