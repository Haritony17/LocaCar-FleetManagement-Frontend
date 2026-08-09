import type { Vehicule } from '../types/Vehicule';

export const mockVehicules: Vehicule[] = [
  {
    id_vehicule: '1', marque: 'Toyota', modele: 'Corolla', categorie: 'Citadine',
    anee: '2022', nombre_places: 5, type_boite_vitesse: 'Automatique', motorisation: 'Essence',
    immatriculation: '1234 TBA', statut: 'DISPONIBLE',
    tarif_journalier_specifique: null, tarif_defaut_categorie: 30, compteur_km_initial: 12500,
    note_moyenne: 4.5, nombre_avis: 12,
    photo_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
  },
  {
    id_vehicule: '2', marque: 'Hyundai', modele: 'Tucson', categorie: 'SUV',
    anee: '2023', nombre_places: 5, type_boite_vitesse: 'Automatique', motorisation: 'Diesel',
    immatriculation: '5678 TBA', statut: 'LOUEE',
    tarif_journalier_specifique: 55, tarif_defaut_categorie: 50, compteur_km_initial: 8200,
    note_moyenne: 4.8, nombre_avis: 8,
    photo_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop',
  },
  {
    id_vehicule: '3', marque: 'Renault', modele: 'Clio', categorie: 'Citadine',
    anee: '2021', nombre_places: 5, type_boite_vitesse: 'Manuelle', motorisation: 'Essence',
    immatriculation: '9012 TBA', statut: 'NETTOYAGE',
    tarif_journalier_specifique: null, tarif_defaut_categorie: 25, compteur_km_initial: 21000,
    note_moyenne: 4.2, nombre_avis: 20,
    photo_url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&h=400&fit=crop',
  },
  {
    id_vehicule: '4', marque: 'Kia', modele: 'Sportage', categorie: 'SUV',
    anee: '2023', nombre_places: 7, type_boite_vitesse: 'Automatique', motorisation: 'Hybride',
    immatriculation: '3456 TBA', statut: 'EN_MAINTENANCE',
    tarif_journalier_specifique: null, tarif_defaut_categorie: 60, compteur_km_initial: 5400,
    note_moyenne: 4.6, nombre_avis: 5,
    photo_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop',
  },
  {
    id_vehicule: '5', marque: 'Nissan', modele: 'Leaf', categorie: 'Citadine',
    anee: '2022', nombre_places: 5, type_boite_vitesse: 'Automatique', motorisation: 'Electrique',
    immatriculation: '7890 TBA', statut: 'DISPONIBLE',
    tarif_journalier_specifique: null, tarif_defaut_categorie: 40, compteur_km_initial: 9800,
    note_moyenne: 4.7, nombre_avis: 15,
    photo_url: 'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=600&h=400&fit=crop',
  },
  {
    id_vehicule: '6', marque: 'Peugeot', modele: '508', categorie: 'Berline',
    anee: '2021', nombre_places: 5, type_boite_vitesse: 'Manuelle', motorisation: 'Diesel',
    immatriculation: '2345 TBA', statut: 'DISPONIBLE',
    tarif_journalier_specifique: null, tarif_defaut_categorie: 35, compteur_km_initial: 15600,
    note_moyenne: 4.3, nombre_avis: 9,
    photo_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop',
  },
];

export const mockAvis = [
  { id: '1', id_vehicule: '1', note: 5, commentaire: 'Voiture impeccable, très confortable.', auteur: 'Rina M.' },
  { id: '2', id_vehicule: '1', note: 4, commentaire: 'Bon rapport qualité/prix, RAS.', auteur: 'Tojo R.' },
  { id: '3', id_vehicule: '2', note: 5, commentaire: 'Parfait pour la famille, spacieux.', auteur: 'Hery A.' },
];