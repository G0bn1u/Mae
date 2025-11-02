import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Layout from '../components/Layout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Page Idées — avec Thématique / Sous‑thématique
 */

export default function Idees() {
  // ----------------------- Auth helper -----------------------
  const token = useMemo(() => {
    const fromWindow = typeof window !== "undefined" && window.__AUTH_TOKEN__;
    const fromLocalStorage =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("token")
        : null;
    return fromWindow || fromLocalStorage || null;
  }, []);

  const authCfg = useMemo(
    () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    [token]
  );

  // ----------------------- State ----------------------------
  const [idees, setIdees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [themes, setThemes] = useState([]);
  const [subthemes, setSubthemes] = useState([]); // dépend des filtres
  const [subthemesForForm, setSubthemesForForm] = useState([]); // dépend du formulaire

  const [filters, setFilters] = useState({ theme: "", subtheme: "" });

  // modes de création : utiliser existant vs nouveau
  const [createModeTheme, setCreateModeTheme] = useState("existing"); // existing | new
  const [createModeSubtheme, setCreateModeSubtheme] = useState("existing"); // existing | new

  const [form, setForm] = useState({
    title: "",
    description: "",
    theme: "",
    subtheme: "",
  });

  useEffect(() => {
    fetchIdees();
  }, []);

  const fetchIdees = async () => {
    try {
      const response = await axios.get(`${API}/idees`);
      setIdees(response.data);
    } catch (error) {
      console.error('Error fetching idees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIdee) {
        await axios.put(`${API}/idees/${editingIdee._id}`, formData);
        toast({ title: 'Idée mise à jour' });
      } else {
        await axios.post(`${API}/idees`, formData);
        toast({ title: 'Idée ajoutée' });
      }
      fetchIdees();
      setIsDialogOpen(false);
      setFormData({ title: '', description: '' });
      setEditingIdee(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette idée ?')) {
      try {
        await axios.delete(`${API}/idees/${id}`);
        toast({ title: 'Idée supprimée' });
        fetchIdees();
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur' });
      }
    }
  };

  const openEditDialog = (idee) => {
    setEditingIdee(idee);
    setFormData({ title: idee.title, description: idee.description });
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-serif text-white">Idées</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingIdee(null); setFormData({ title: '', description: '' }); }} className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Ajouter une idée
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingIdee ? 'Éditer' : 'Nouvelle'} Idée</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Titre</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={5} className="bg-[#1e293b] border-slate-600 text-white" />
                </div>
                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600">{editingIdee ? 'Mettre à jour' : 'Ajouter'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {idees.length === 0 ? (
            <div className="col-span-full bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-8 text-center">
              <p className="text-slate-400">Aucune idée enregistrée</p>
            </div>
          ) : (
            idees.map((idee) => (
              <div key={idee._id} className="bg-[#0f172a]/60 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
                <Lightbulb className="w-8 h-8 text-amber-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{idee.title}</h3>
                {idee.description && <p className="text-slate-300 text-sm mb-4">{idee.description}</p>}
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(idee)} className="text-slate-400 hover:text-white">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(idee._id)} className="text-red-400 hover:text-red-300">
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

export default Idees;