import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { fetchUserProfile, updateUserProfile } from '@/services/userApi';
import { fetchMyDocuments, uploadKycDocument, type DocumentKyc } from '@/services/kycApi';

const kycLabel: Record<string, { text: string; color: string }> = {
  PENDING: { text: '⏳ En attente de validation', color: 'bg-amber-100 text-amber-700' },
  APPROVED: { text: '✅ Profil validé', color: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { text: '❌ Refusé', color: 'bg-red-100 text-red-700' },
  NOT_SUBMITTED: { text: 'Documents non envoyés', color: 'bg-slate-100 text-slate-700' },
};

export default function Profil() {
  const { user } = useAuth();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [kycStatus, setKycStatus] = useState('NOT_SUBMITTED');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [documents, setDocuments] = useState<DocumentKyc[]>([]);
  const [uploadingCin, setUploadingCin] = useState(false);
  const [uploadingPermis, setUploadingPermis] = useState(false);
  const [kycErreur, setKycErreur] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchUserProfile(user.id)
      .then((data) => {
        setNom(data.lastName);
        setPrenom(data.firstName);
        setEmail(data.email);
        setTelephone(data.phone);
        setAdresse(data.address);
        setKycStatus(data.kycStatus);
      })
      .catch(() => setErreur('Impossible de charger ton profil.'))
      .finally(() => setLoading(false));
  }, [user]);
  useEffect(() => {
  fetchMyDocuments()
    .then(setDocuments)
    .catch(() => {});
}, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setErreur('');
    setSucces('');
    try {
      await updateUserProfile(user.id, {
        firstName: prenom,
        lastName: nom,
        phone: telephone,
        address: adresse,
      });
      setSucces('Informations mises à jour avec succès.');
    } catch {
      setErreur('Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Chargement...</p>;

  const kyc = kycLabel[kycStatus] ?? kycLabel.NOT_SUBMITTED;
  const handleUploadDocument = async (type: 'CIN' | 'DRIVING_LICENSE', file: File) => {
  setKycErreur('');
  const setUploading = type === 'CIN' ? setUploadingCin : setUploadingPermis;
  setUploading(true);
  try {
    await uploadKycDocument(type, file);
    const updated = await fetchMyDocuments();
    setDocuments(updated);
  } catch (err: any) {
    setKycErreur(err?.response?.data?.detail || "Erreur lors de l'envoi du document.");
  } finally {
    setUploading(false);
  }
};

const getDocStatus = (type: 'CIN' | 'DRIVING_LICENSE') => documents.find((d) => d.documentType === type);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Profil & Documents</h1>
        <p className="text-muted-foreground text-sm">Gère tes informations personnelles et le statut de vérification.</p>
      </div>

      <Card>
        <CardContent className="p-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="font-semibold">Statut de vérification KYC</p>
            <p className="text-sm text-muted-foreground">Permis de conduire et pièce d'identité</p>
          </div>
          <Badge className={`${kyc.color} hover:${kyc.color}`}>{kyc.text}</Badge>
        </CardContent>
      </Card>
      <Card>
  <CardContent className="p-6 flex flex-col gap-4">
    <p className="font-semibold">Documents d'identité</p>
    {kycErreur && <p className="text-sm text-red-600">{kycErreur}</p>}

    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm font-medium">Carte d'identité (CIN)</p>
          {getDocStatus('CIN') ? (
            <Badge className={
              getDocStatus('CIN')!.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
              getDocStatus('CIN')!.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }>
              {getDocStatus('CIN')!.status === 'APPROVED' ? '✅ Validé' :
               getDocStatus('CIN')!.status === 'REJECTED' ? '❌ Refusé' : '⏳ En attente'}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Non envoyé</span>
          )}
        </div>
        <Input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          disabled={uploadingCin}
          className="max-w-[220px]"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadDocument('CIN', file);
          }}
        />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t">
        <div>
          <p className="text-sm font-medium">Permis de conduire</p>
          {getDocStatus('DRIVING_LICENSE') ? (
            <Badge className={
              getDocStatus('DRIVING_LICENSE')!.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
              getDocStatus('DRIVING_LICENSE')!.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }>
              {getDocStatus('DRIVING_LICENSE')!.status === 'APPROVED' ? '✅ Validé' :
               getDocStatus('DRIVING_LICENSE')!.status === 'REJECTED' ? '❌ Refusé' : '⏳ En attente'}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Non envoyé</span>
          )}
        </div>
        <Input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          disabled={uploadingPermis}
          className="max-w-[220px]"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadDocument('DRIVING_LICENSE', file);
          }}
        />
      </div>
    </div>
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

          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
          {succes && <p className="text-sm text-emerald-600">{succes}</p>}

          <Button onClick={handleSave} disabled={saving} className="w-fit mt-2">
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}