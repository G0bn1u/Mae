import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Plus, Pencil, Trash2, Dices } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const De10 = () => {
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [formData, setFormData] = useState({ number: 1, text: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API}/de10`);
      setOptions(response.data.sort((a, b) => a.number - b.number));
    } catch (error) {
      console.error('Error fetching de10 options:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOption) {
        await axios.put(`${API}/de10/${editingOption._id}`, formData);
        toast({ title: 'Option mise à jour' });
      } else {
        await axios.post(`${API}/de10`, formData);
        toast({ title: 'Option ajoutée' });
      }
      fetchOptions();
      setIsDialogOpen(false);
      setFormData({ number: 1, text: '' });
      setEditingOption(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette option ?')) {
      try {
        await axios.delete(`${API}/de10/${id}`);
        toast({ title: 'Option supprimée' });
        fetchOptions();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur' });
      }
    }
  };

  const rollDice = () => {
    if (options.length === 0) {
      toast({ variant: 'destructive', title: 'Ajoutez des options d\'abord' });
      return;
    }
    const randomIndex = Math.floor(Math.random() * options.length);
    setResult(options[randomIndex]);
  };

  const openEditDialog = (option) => {
    setEditingOption(option);
    setFormData({ number: option.number, text: option.text });
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-serif text-white">Dé 10</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingOption(null); setFormData({ number: (options.length + 1), text: '' }); }} className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Nouvelle option
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingOption ? 'Éditer' : 'Nouvelle'} Option</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Numéro (1-10)</Label>
                  <Input type="number" min="1" max="10" value={formData.number} onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Texte</Label>
                  <Input value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">{editingOption ? 'Mettre à jour' : 'Ajouter'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dice Result */}
        {result && (
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md rounded-lg border border-purple-500/50 p-8 mb-6 text-center animate-in fade-in duration-500">
            <Dices className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Résultat: {result.number}</h2>
            <p className="text-xl text-purple-200">{result.text}</p>
          </div>
        )}

        {/* Roll Button */}
        <div className="text-center mb-8">
          <Button onClick={rollDice} disabled={options.length === 0} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
            <Dices className="w-6 h-6 mr-2" />
            Lancer le dé
          </Button>
        </div>

        {/* Options List */}
        <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
          <h2 className="text-xl text-white mb-4">Options</h2>
          {options.length === 0 ? (
            <p className="text-slate-400 text-center py-4">Aucune option configurée</p>
          ) : (
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option._id} className="flex items-center justify-between bg-slate-800/50 rounded p-3 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-700 text-white w-8 h-8 rounded flex items-center justify-center font-bold">
                      {option.number}
                    </div>
                    <span className="text-slate-100">{option.text}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(option)} className="text-slate-400 hover:text-white">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(option._id)} className="text-red-400 hover:text-red-300">
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

export default De10;