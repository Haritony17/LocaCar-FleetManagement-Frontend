import Navbar from '@/components/shared/Navbar';
import MoteurRecherche from '@/components/shared/MoteurRecherche';

export default function Accueil() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Louez le véhicule qu'il vous faut</h1>
        <p className="text-muted-foreground mb-10">Recherchez, comparez et réservez en quelques clics.</p>
        <MoteurRecherche />
      </div>
    </div>
  );
}