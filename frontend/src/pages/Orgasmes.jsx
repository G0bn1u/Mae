import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Orgasmes = () => {
  const [orgasmes, setOrgasmes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', type: 'autorisé', notes: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchOrgasmes();
  }, []);

  const fetchOrgasmes = async () => {
    try {
      const response = await axios.get(`${API}/orgasmes`);
      setOrgasmes(response.data);
    } catch (error) {
      console.error('Error fetching orgasmes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/orgasmes`, formData);
      toast({ title: 'Orgasme ajouté' });
      fetchOrgasmes();
      setIsDialogOpen(false);
      setFormData({ date: '', type: 'autorisé', notes: '' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      try {
        await axios.delete(`${API}/orgasmes/${id}`);
        toast({ title: 'Orgasme supprimé' });
        fetchOrgasmes();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur' });
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-serif text-white">Orgasmes</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData({ date: '', type: 'autorisé', notes: '' })} className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Nouvel Orgasme</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Date</Label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-[#1e293b] border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border-slate-600">
                      <SelectItem value="autorisé" className="text-white">Autorisé</SelectItem>
                      <SelectItem value="ruiné" className="text-white">Ruiné</SelectItem>
                      <SelectItem value="refusé" className="text-white">Refusé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Notes</Label>
                  <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">Ajouter</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-4 lg:p-6">
          <h2 className="text-xl text-white mb-4">Historique</h2>
          {orgasmes.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Aucun enregistrement</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-300 pb-3 px-2">Date</th>
                    <th className="text-left text-slate-300 pb-3 px-2">Type</th>
                    <th className="text-left text-slate-300 pb-3 px-2 hidden lg:table-cell">Notes</th>
                    <th className="text-right text-slate-300 pb-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orgasmes.map((orgasme) => (
                    <tr key={orgasme._id} className="border-b border-slate-800">
                      <td className="py-3 px-2 text-slate-300 text-sm">{new Date(orgasme.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs ${orgasme.type === 'ruiné' ? 'bg-red-900/30 text-red-400' : orgasme.type === 'refusé' ? 'bg-gray-700 text-gray-300' : 'bg-green-900/30 text-green-400'}`}>
                          {orgasme.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-400 text-sm hidden lg:table-cell">{orgasme.notes}</td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(orgasme._id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

export default Orgasmes;