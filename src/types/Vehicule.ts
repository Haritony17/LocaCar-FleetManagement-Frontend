export type StatutVehicule = 'DISPONIBLE' | 'LOUEE' | 'NETTOYAGE' | 'EN_MAINTENANCE';

export interface Vehicule {
  id_vehicule: string;
  marque: string;
  modele: string;
  categorie: string;
  anee: string;
  nombre_places: number;
  type_boite_vitesse: string;
  motorisation: string;
  immatriculation: string;
  statut: StatutVehicule;
  tarif_journalier_specifique: number | null; // null = fallback catégorie
  tarif_defaut_categorie: number;
  compteur_km_initial: number;
  note_moyenne: number;
  nombre_avis: number;
  photo_url: string;
}