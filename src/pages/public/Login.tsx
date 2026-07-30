import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import api from '@/services/api';

interface TokenPayload {
  roles: string[];
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);

    try {
      const response = await api.post('/login_check', { email, password: motDePasse });
      const token = response.data.token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode<TokenPayload>(token);
      navigate(decoded.roles.includes('ROLE_ADMIN') ? '/admin/dashboard' : '/mon-compte');
    } catch {
      setErreur('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex justify-center pt-16 px-4">
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