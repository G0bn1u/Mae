import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Rituels = () => {
  const [rituels, setRituels] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRituel, setEditingRituel] = useState(null);
  const [formData, setFormData] = useState({ number: 1, text: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchRituels();
  }, []);

  const fetchRituels = async () => {
    try {
      const response = await axios.get(`${API}/rituels`);
      setRituels(response.data.sort((a, b) => a.number - b.number));
    } catch (error) {
      console.error('Error fetching rituels:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRituel) {
        await axios.put(`${API}/rituels/${editingRituel._id}`, formData);
        toast({ title: 'Rituel mis à jour' });
      } else {
        await axios.post(`${API}/rituels`, formData);
        toast({ title: 'Rituel ajouté' });
      }
      fetchRituels();
      setIsDialogOpen(false);
      setFormData({ number: 1, text: '' });
      setEditingRituel(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rituel ?')) {
      try {
        await axios.delete(`${API}/rituels/${id}`);
        toast({ title: 'Rituel supprimé' });
        fetchRituels();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur' });
      }
    }
  };

  const openEditDialog = (rituel) => {
    setEditingRituel(rituel);
    setFormData({ number: rituel.number, text: rituel.text });
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-serif text-white">Rituels</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingRituel(null); setFormData({ number: (rituels.length + 1), text: '' }); }} className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Ajouter un rituel
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingRituel ? 'Éditer' : 'Nouveau'} Rituel</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Numéro</Label>
                  <Input type="number" min="1" value={formData.number} onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Texte</Label>
                  <Input value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">{editingRituel ? 'Mettre à jour' : 'Ajouter'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-6 lg:p-8">
          <h2 className="text-2xl font-serif text-white mb-6">Les Commandements</h2>
          {rituels.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Aucun rituel défini</p>
          ) : (
            <div className="space-y-4">
              {rituels.map((rituel) => (
                <div key={rituel._id} className="flex items-start gap-4 bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                  <div className="bg-slate-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {rituel.number}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-100 leading-relaxed">{rituel.text}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(rituel)} className="text-slate-400 hover:text-white">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(rituel._id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Rituels;