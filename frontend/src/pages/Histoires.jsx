import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Plus, BookOpen, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Histoires = () => {
  const [histoires, setHistoires] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReadDialogOpen, setIsReadDialogOpen] = useState(false);
  const [editingHistoire, setEditingHistoire] = useState(null);
  const [readingHistoire, setReadingHistoire] = useState(null);
  const [formData, setFormData] = useState({ title: '', date: '', content: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchHistoires();
  }, []);

  const fetchHistoires = async () => {
    try {
      const response = await axios.get(`${API}/histoires`);
      setHistoires(response.data);
    } catch (error) {
      console.error('Error fetching histoires:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHistoire) {
        await axios.put(`${API}/histoires/${editingHistoire._id}`, formData);
        toast({ title: 'Histoire mise à jour' });
      } else {
        await axios.post(`${API}/histoires`, formData);
        toast({ title: 'Histoire ajoutée' });
      }
      fetchHistoires();
      setIsDialogOpen(false);
      setFormData({ title: '', date: '', content: '' });
      setEditingHistoire(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette histoire ?')) {
      try {
        await axios.delete(`${API}/histoires/${id}`);
        toast({ title: 'Histoire supprimée' });
        fetchHistoires();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur' });
      }
    }
  };

  const openEditDialog = (histoire) => {
    setEditingHistoire(histoire);
    setFormData({ title: histoire.title, date: histoire.date, content: histoire.content });
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-serif text-white">Histoires</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingHistoire(null); setFormData({ title: '', date: '', content: '' }); }} className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Nouvelle histoire
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">{editingHistoire ? 'Éditer' : 'Nouvelle'} Histoire</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Titre</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Date</Label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Contenu</Label>
                  <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows={10} className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">{editingHistoire ? 'Mettre à jour' : 'Ajouter'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {histoires.length === 0 ? (
            <div className="col-span-full bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-8 text-center">
              <p className="text-slate-400">Aucune histoire</p>
            </div>
          ) : (
            histoires.map((histoire) => (
              <div key={histoire._id} className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-6 flex flex-col">
                <BookOpen className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{histoire.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{new Date(histoire.date).toLocaleDateString('fr-FR')}</p>
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">{histoire.content}</p>
                <div className="mt-auto flex gap-2">
                  <Button onClick={() => { setReadingHistoire(histoire); setIsReadDialogOpen(true); }} className="flex-1 bg-slate-700 hover:bg-slate-600">Lire</Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(histoire)} className="text-slate-400 hover:text-white">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(histoire._id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Read Dialog */}
        <Dialog open={isReadDialogOpen} onOpenChange={setIsReadDialogOpen}>
          <DialogContent className="bg-[#0f172a] border-slate-700 max-w-3xl max-h-[80vh] overflow-y-auto">
            {readingHistoire && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl">{readingHistoire.title}</DialogTitle>
                  <p className="text-slate-400 text-sm">{new Date(readingHistoire.date).toLocaleDateString('fr-FR')}</p>
                </DialogHeader>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{readingHistoire.content}</div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Histoires;