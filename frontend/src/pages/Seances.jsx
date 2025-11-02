import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Seances = () => {
  const [seances, setSeances] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSeance, setEditingSeance] = useState(null);
  const [formData, setFormData] = useState({ date: '', title: '', description: '', duration: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchSeances();
  }, []);

  const fetchSeances = async () => {
    try {
      const response = await axios.get(`${API}/seances`);
      setSeances(response.data);
    } catch (error) {
      console.error('Error fetching seances:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSeance) {
        await axios.put(`${API}/seances/${editingSeance._id}`, formData);
        toast({ title: 'Séance mise à jour' });
      } else {
        await axios.post(`${API}/seances`, formData);
        toast({ title: 'Séance ajoutée' });
      }
      fetchSeances();
      setIsDialogOpen(false);
      setFormData({ date: '', title: '', description: '', duration: '' });
      setEditingSeance(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      try {
        await axios.delete(`${API}/seances/${id}`);
        toast({ title: 'Séance supprimée' });
        fetchSeances();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur' });
      }
    }
  };

  const openEditDialog = (seance) => {
    setEditingSeance(seance);
    setFormData({ date: seance.date, title: seance.title, description: seance.description, duration: seance.duration });
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-serif text-white">Séances</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingSeance(null); setFormData({ date: '', title: '', description: '', duration: '' }); }} className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Nouvelle séance
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingSeance ? 'Éditer' : 'Nouvelle'} Séance</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Date</Label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Titre</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Durée (minutes)</Label>
                  <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={5} className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">{editingSeance ? 'Mettre à jour' : 'Ajouter'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {seances.length === 0 ? (
            <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-8 text-center">
              <p className="text-slate-400">Aucune séance enregistrée</p>
            </div>
          ) : (
            seances.map((seance) => (
              <div key={seance._id} className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{seance.title}</h3>
                    <div className="flex gap-4 mt-1">
                      <p className="text-slate-400 text-sm">{new Date(seance.date).toLocaleDateString('fr-FR')}</p>
                      {seance.duration && <p className="text-slate-400 text-sm">{seance.duration} min</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(seance)} className="text-slate-400 hover:text-white">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(seance._id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {seance.description && <p className="text-slate-300 whitespace-pre-wrap">{seance.description}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Seances;