import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Plus, FileText, Trash2, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', url: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/documents`, formData);
      toast({ title: 'Document ajouté' });
      fetchDocuments();
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', url: '' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await axios.delete(`${API}/documents/${id}`);
        toast({ title: 'Document supprimé' });
        fetchDocuments();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur' });
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-serif text-white">Documents</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData({ title: '', description: '', url: '' })} className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Ajouter un document
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Nouveau Document</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Titre</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">URL du document</Label>
                  <Input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" placeholder="https://..." />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">Ajouter</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {documents.length === 0 ? (
            <div className="col-span-full bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-8 text-center">
              <p className="text-slate-400">Aucun document</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc._id} className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-10 h-10 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2">{doc.title}</h3>
                    {doc.description && <p className="text-slate-400 text-sm mb-3">{doc.description}</p>}
                    <div className="flex gap-2">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                        <Download className="w-4 h-4" />
                        Télécharger
                      </a>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(doc._id)} className="text-red-400 hover:text-red-300 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Documents;