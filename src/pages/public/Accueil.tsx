import Navbar from '@/components/shared/Navbar';
import MoteurRecherche from '@/components/shared/MoteurRecherche';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import { mockVehicules } from '@/data/mockVehicules';
import { Badge } from '@/components/ui/badge';

export default function Accueil() {
  const topVehicules = mockVehicules.slice(0, 3);

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />

      {/* HERO */}
      <div
        className="relative bg-cover bg-center min-h-screen flex items-center -mt-[73px] pt-[73px]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=900&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative w-full px-4 text-center max-w-4xl mx-auto">
          <Badge className="bg-white/15 text-white hover:bg-white/15 mb-4 backdrop-blur-sm">
            🚗 Location de véhicules à Madagascar
          </Badge>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Louez le véhicule qu'il vous faut
          </h1>
          <p className="text-white/85 text-lg mb-10 max-w-xl mx-auto">
            Des citadines aux SUV, réservez en ligne en toute simplicité et prenez la route en quelques minutes.
          </p>

          <MoteurRecherche />
        </div>
      </div>

      {/* RÉASSURANCE */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
              <MapPin size={22} />
            </div>
            <p className="font-semibold text-foreground">Suivi GPS en temps réel</p>
            <p className="text-sm text-muted-foreground">
              Suivez votre véhicule en direct pendant toute la durée de votre location.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
              <ShieldCheck size={22} />
            </div>
            <p className="font-semibold text-foreground">Assistance 7j/7</p>
            <p className="text-sm text-muted-foreground">
              Une équipe disponible pour vous accompagner à chaque étape de votre location.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
              <CreditCard size={22} />
            </div>
            <p className="font-semibold text-foreground">Paiement sécurisé</p>
            <p className="text-sm text-muted-foreground">
              Mobile Money ou paiement en agence, en toute simplicité et sécurité.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* VITRINE */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-semibold text-foreground mb-6">Les véhicules les mieux notés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topVehicules.map((v) => (
            <div key={v.id_vehicule} className="relative rounded-2xl overflow-hidden group h-56">
              <img
                src={v.photo_url}
                alt={v.marque}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <Badge className="bg-white/20 text-white hover:bg-white/20 mb-2">⭐ {v.note_moyenne}</Badge>
                <p className="font-semibold text-lg">{v.marque} {v.modele}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}