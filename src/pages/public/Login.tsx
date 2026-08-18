import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);

    const result = await login(email, motDePasse);
    setLoading(false);

    if (!result.success) {
      setErreur('Email ou mot de passe incorrect.');
      return;
    }

    const from = (location.state as { from?: string })?.from;
    navigate(from ?? '/mon-compte');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center pt-16 px-4 pb-16">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-1">Connexion</h1>
            <p className="text-muted-foreground text-sm mb-6">Accède à ton compte LocaCar.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required className="mt-1" />
              </div>

              {erreur && <p className="text-sm text-red-600">{erreur}</p>}

              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Pas encore de compte ? <Link to="/register" className="text-teal-600 font-medium hover:underline">S'inscrire</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}