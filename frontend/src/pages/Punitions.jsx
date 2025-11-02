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

const Punitions = () => {
  const [punitions, setPunitions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPunition, setEditingPunition] = useState(null);
  const [formData, setFormData] = useState({ date: '', nature: '', raison: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchPunitions();
  }, []);

  const fetchPunitions = async () => {
    try {
      const response = await axios.get(`${API}/punitions`);
      setPunitions(response.data);
    } catch (error) {
      console.error('Error fetching punitions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPunition) {
        await axios.put(`${API}/punitions/${editingPunition._id}`, formData);
        toast({ title: 'Punition mise à jour' });
      } else {
        await axios.post(`${API}/punitions`, formData);
        toast({ title: 'Punition ajoutée' });
      }
      fetchPunitions();
      setIsDialogOpen(false);
      setFormData({ date: '', nature: '', raison: '' });
      setEditingPunition(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette punition ?')) {
      try {
        await axios.delete(`${API}/punitions/${id}`);
        toast({ title: 'Punition supprimée' });
        fetchPunitions();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur' });
      }
    }
  };

  const openEditDialog = (punition) => {
    setEditingPunition(punition);
    setFormData({ date: punition.date, nature: punition.nature, raison: punition.raison });
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-serif text-white">Punitions</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingPunition(null); setFormData({ date: '', nature: '', raison: '' }); }} className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingPunition ? 'Éditer' : 'Nouvelle'} Punition</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Date</Label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Nature</Label>
                  <Input value={formData.nature} onChange={(e) => setFormData({ ...formData, nature: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Raison</Label>
                  <Textarea value={formData.raison} onChange={(e) => setFormData({ ...formData, raison: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">{editingPunition ? 'Mettre à jour' : 'Ajouter'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-4 lg:p-6">
          {punitions.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Aucune punition enregistrée</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-300 pb-3 px-2">Date</th>
                    <th className="text-left text-slate-300 pb-3 px-2">Nature</th>
                    <th className="text-left text-slate-300 pb-3 px-2 hidden lg:table-cell">Raison</th>
                    <th className="text-right text-slate-300 pb-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {punitions.map((punition) => (
                    <tr key={punition._id} className="border-b border-slate-800">
                      <td className="py-3 px-2 text-slate-300 text-sm">{new Date(punition.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-3 px-2 text-slate-100">{punition.nature}</td>
                      <td className="py-3 px-2 text-slate-400 text-sm hidden lg:table-cell">{punition.raison}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(punition)} className="text-slate-400 hover:text-white">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(punition._id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Punitions;