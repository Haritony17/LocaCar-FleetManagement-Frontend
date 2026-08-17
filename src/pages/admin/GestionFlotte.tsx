import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  fetchVehicles, createVehicle, updateVehicleStatus,
  fetchAgencies, createAgency,
  fetchCategories, createCategory,
  type Vehicle, type Agency, type Category,
} from '@/services/vehiclesApi';

const statutLabel: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RENTED: 'Louée',
  MAINTENANCE: 'Maintenance',
  OUT_OF_SERVICE: 'Hors service',
};

const statutColor: Record<string, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  RENTED: 'bg-blue-100 text-blue-700',
  MAINTENANCE: 'bg-amber-100 text-amber-700',
  OUT_OF_SERVICE: 'bg-red-100 text-red-700',
};

export default function GestionFlotte() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recherche, setRecherche] = useState('');
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const [openAgencyDialog, setOpenAgencyDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const [form, setForm] = useState({
    licensePlate: '', brand: '', model: '', year: '2023', seats: '5',
    gearboxType: 'AUTOMATIC', fuelType: 'PETROL', initialMileage: '0',
    agencyId: '', categoryId: '',
  });

  const [agencyForm, setAgencyForm] = useState({ name: '', address: '', city: '', phone: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', dailyRate: '30' });

  const loadAll = async () => {
    setLoading(true);
    setErreur('');
    try {
      const [v, a, c] = await Promise.all([fetchVehicles(), fetchAgencies(), fetchCategories()]);
      setVehicles(v);
      setAgencies(a);
      setCategories(c);
    } catch {
      setErreur('Impossible de charger les données de la flotte.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateVehicle = async () => {
    try {
      await createVehicle({
        licensePlate: form.licensePlate,
        brand: form.brand,
        model: form.model,
        year: Number(form.year),
        seats: Number(form.seats),
        gearboxType: form.gearboxType,
        fuelType: form.fuelType,
        initialMileage: form.initialMileage,
        agencyId: form.agencyId,
        categoryId: form.categoryId,
      });
      setOpenVehicleDialog(false);
      setForm({ licensePlate: '', brand: '', model: '', year: '2023', seats: '5', gearboxType: 'AUTOMATIC', fuelType: 'PETROL', initialMileage: '0', agencyId: '', categoryId: '' });
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Erreur lors de la création du véhicule.');
    }
  };

  const handleCreateAgency = async () => {
    try {
      await createAgency(agencyForm);
      setOpenAgencyDialog(false);
      setAgencyForm({ name: '', address: '', city: '', phone: '' });
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Erreur lors de la création de l'agence.");
    }
  };

  const handleCreateCategory = async () => {
    try {
      await createCategory({ name: categoryForm.name, description: categoryForm.description, dailyRate: Number(categoryForm.dailyRate) });
      setOpenCategoryDialog(false);
      setCategoryForm({ name: '', description: '', dailyRate: '30' });
      loadAll();
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Erreur lors de la création de la catégorie.');
    }
  };

  const changerStatut = async (id: string, status: string) => {
    try {
      await updateVehicleStatus(id, status);
      loadAll();
    } catch {
      alert('Erreur lors du changement de statut.');
    }
  };

  const vehiculesFiltres = vehicles.filter((v) =>
    `${v.brand} ${v.model} ${v.licensePlate}`.toLowerCase().includes(recherche.toLowerCase())
  );

  if (loading) return <p className="text-muted-foreground">Chargement...</p>;
  if (erreur) return <p className="text-red-600">{erreur}</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Gestion de la Flotte</h1>
          <p className="text-muted-foreground text-sm">{vehicles.length} véhicules enregistrés</p>
        </div>

        <div className="flex gap-2">
          <Dialog open={openAgencyDialog} onOpenChange={setOpenAgencyDialog}>
            <DialogTrigger render={<Button variant="outline">+ Agence</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle agence</DialogTitle></DialogHeader>
              <div className="flex flex-col gap-3 mt-2">
                <div><Label>Nom</Label><Input value={agencyForm.name} onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })} className="mt-1" /></div>
                <div><Label>Adresse</Label><Input value={agencyForm.address} onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })} className="mt-1" /></div>
                <div><Label>Ville</Label><Input value={agencyForm.city} onChange={(e) => setAgencyForm({ ...agencyForm, city: e.target.value })} className="mt-1" /></div>
                <div><Label>Téléphone</Label><Input value={agencyForm.phone} onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })} className="mt-1" /></div>
              </div>
              <DialogFooter className="mt-4"><Button onClick={handleCreateAgency}>Créer</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
            <DialogTrigger render={<Button variant="outline">+ Catégorie</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle catégorie</DialogTitle></DialogHeader>
              <div className="flex flex-col gap-3 mt-2">
                <div><Label>Nom</Label><Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="mt-1" /></div>
                <div><Label>Description</Label><Input value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className="mt-1" /></div>
                <div><Label>Tarif/jour ($)</Label><Input type="number" value={categoryForm.dailyRate} onChange={(e) => setCategoryForm({ ...categoryForm, dailyRate: e.target.value })} className="mt-1" /></div>
              </div>
              <DialogFooter className="mt-4"><Button onClick={handleCreateCategory}>Créer</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openVehicleDialog} onOpenChange={setOpenVehicleDialog}>
            <DialogTrigger render={<Button>+ Ajouter un véhicule</Button>} />
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Nouveau véhicule</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-2 max-h-[60vh] overflow-y-auto pr-1">
                <div className="col-span-2"><Label>Immatriculation</Label><Input value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} className="mt-1" /></div>
                <div><Label>Marque</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="mt-1" /></div>
                <div><Label>Modèle</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="mt-1" /></div>
                <div><Label>Année</Label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-1" /></div>
                <div><Label>Places</Label><Input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="mt-1" /></div>

                <div>
                  <Label>Boîte</Label>
                  <Select value={form.gearboxType} onValueChange={(v) => setForm({ ...form, gearboxType: v! })}>
                    <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANUAL">Manuelle</SelectItem>
                      <SelectItem value="AUTOMATIC">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Motorisation</Label>
                  <Select value={form.fuelType} onValueChange={(v) => setForm({ ...form, fuelType: v! })}>
                    <SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PETROL">Essence</SelectItem>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                      <SelectItem value="HYBRID">Hybride</SelectItem>
                      <SelectItem value="ELECTRIC">Électrique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2"><Label>Kilométrage initial</Label><Input type="number" value={form.initialMileage} onChange={(e) => setForm({ ...form, initialMileage: e.target.value })} className="mt-1" /></div>

                <div className="col-span-2">
                  <Label>Agence</Label>
                  <Select value={form.agencyId} onValueChange={(v) => setForm({ ...form, agencyId: v! })}>
                    <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="Choisir une agence" /></SelectTrigger>
                    <SelectContent>
                      {agencies.map((a) => <SelectItem key={a.id} value={a.id}>{a.name} — {a.city}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {agencies.length === 0 && <p className="text-xs text-amber-600 mt-1">Crée d'abord une agence.</p>}
                </div>

                <div className="col-span-2">
                  <Label>Catégorie</Label>
                  <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v! })}>
                    <SelectTrigger className="mt-1 w-full"><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.dailyRate} $/j)</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && <p className="text-xs text-amber-600 mt-1">Crée d'abord une catégorie.</p>}
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={handleCreateVehicle} disabled={!form.agencyId || !form.categoryId}>Créer le véhicule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Input
        placeholder="Rechercher par marque, modèle, immatriculation..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Immatriculation</TableHead>
                <TableHead>Tarif/jour</TableHead>
                <TableHead>Km</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehiculesFiltres.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucun véhicule pour l'instant.</TableCell></TableRow>
              )}
              {vehiculesFiltres.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <p className="font-medium">{v.brand} {v.model}</p>
                    <p className="text-xs text-muted-foreground">{v.year}</p>
                  </TableCell>
                  <TableCell>{v.licensePlate}</TableCell>
                  <TableCell>{v.effectiveDailyRate} $</TableCell>
                  <TableCell>{Number(v.initialMileage).toLocaleString('fr-FR')} km</TableCell>
                  <TableCell>
                    <Badge className={`${statutColor[v.status]} hover:${statutColor[v.status]}`}>
                      {statutLabel[v.status] ?? v.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select value={v.status} onValueChange={(val) => changerStatut(v.id, val!)}>
                      <SelectTrigger className="w-40 ml-auto"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Disponible</SelectItem>
                        <SelectItem value="RENTED">Louée</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="OUT_OF_SERVICE">Hors service</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}