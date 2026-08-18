import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import { useAuth } from '@/context/AuthContext';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

export default function Register() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');

    if (motDePasse !== confirmMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }
    if (motDePasse.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (!PASSWORD_REGEX.test(motDePasse)) {
      setErreur('Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.');
      return;
    }

    setLoading(true);
    const result = await register({
      email,
      password: motDePasse,
      firstName: prenom,
      lastName: nom,
      address: adresse || undefined,
      phone: telephone || undefined,
    });
    setLoading(false);

    if (!result.success) {
      setErreur(typeof result.error === 'string' ? result.error : "Une erreur est survenue lors de l'inscription.");
      return;
    }

    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center py-16 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-1">Créer un compte</h1>
            <p className="text-muted-foreground text-sm mb-6">Rejoins LocaCar en quelques secondes.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
              </div>

              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">
                  8 caractères min., avec majuscule, minuscule, chiffre et caractère spécial.
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input id="confirmPassword" type="password" value={confirmMotDePasse} onChange={(e) => setConfirmMotDePasse(e.target.value)} required className="mt-1" />
              </div>

              {erreur && <p className="text-sm text-red-600">{erreur}</p>}

              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? 'Création...' : 'Créer mon compte'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Déjà un compte ? <Link to="/login" className="text-teal-600 font-medium hover:underline">Se connecter</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}