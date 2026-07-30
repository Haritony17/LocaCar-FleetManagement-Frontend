import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Profil() {
  const [nom, setNom] = useState('Rakoto');
  const [prenom, setPrenom] = useState('Jean');
  const [email] = useState('jean.rakoto@example.com');
  const [telephone, setTelephone] = useState('034 12 345 67');
  const [adresse, setAdresse] = useState('Antananarivo');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Profil & Documents</h1>
        <p className="text-muted-foreground text-sm">Gère tes informations personnelles et le statut de vérification.</p>
      </div>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="font-semibold">Statut de vérification KYC</p>
            <p className="text-sm text-muted-foreground">Permis de conduire et pièce d'identité</p>
          </div>
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">⏳ En attente de validation</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col gap-4">
          <p className="font-semibold">Mes informations</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Nom</label>
              <Input value={nom} onChange={(e) => setNom(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Prénom</label>
              <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} className="mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <Input value={email} disabled className="mt-1" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Téléphone</label>
            <Input value={telephone} onChange={(e) => setTelephone(e.target.value)} className="mt-1" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Adresse</label>
            <Input value={adresse} onChange={(e) => setAdresse(e.target.value)} className="mt-1" />
          </div>

          <Button className="w-fit mt-2">Enregistrer les modifications</Button>
        </CardContent>
      </Card>
    </div>
  );
}