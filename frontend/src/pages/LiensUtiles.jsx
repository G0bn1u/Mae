import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LiensUtiles = () => {
  const [liens, setLiens] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLien, setEditingLien] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchLiens();
  }, []);

  const fetchLiens = async () => {
    try {
      const response = await axios.get(`${API}/liens`);
      setLiens(response.data);
    } catch (error) {
      console.error('Error fetching liens:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLien) {
        await axios.put(`${API}/liens/${editingLien._id}`, formData);
        toast({ title: 'Lien mis à jour' });
      } else {
        await axios.post(`${API}/liens`, formData);
        toast({ title: 'Lien ajouté' });
      }
      fetchLiens();
      setIsDialogOpen(false);
      setFormData({ title: '', url: '', description: '' });
      setEditingLien(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce lien ?')) {
      try {
        await axios.delete(`${API}/liens/${id}`);
        toast({ title: 'Lien supprimé' });
        fetchLiens();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur' });
      }
    }
  };

  const openEditDialog = (lien) => {
    setEditingLien(lien);
    setFormData({ title: lien.title, url: lien.url, description: lien.description });
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-serif text-white">Liens Utiles</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingLien(null); setFormData({ title: '', url: '', description: '' }); }} className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Ajouter un lien
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingLien ? 'Éditer' : 'Nouveau'} Lien</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Titre</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">URL</Label>
                  <Input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">{editingLien ? 'Mettre à jour' : 'Ajouter'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {liens.length === 0 ? (
            <div className="col-span-full bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-8 text-center">
              <p className="text-slate-400">Aucun lien enregistré</p>
            </div>
          ) : (
            liens.map((lien) => (
              <div key={lien._id} className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">{lien.title}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(lien)} className="text-slate-400 hover:text-white">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(lien._id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {lien.description && <p className="text-slate-400 text-sm mb-3">{lien.description}</p>}
                <a href={lien.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir le lien
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LiensUtiles;