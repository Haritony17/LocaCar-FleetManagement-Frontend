export interface Agence {
  id_agence: string;
  nom: string;
  ville: string;
}

export const mockAgences: Agence[] = [
  { id_agence: '1', nom: 'Agence Analakely', ville: 'Antananarivo' },
  { id_agence: '2', nom: 'Agence Ivato Aéroport', ville: 'Antananarivo' },
  { id_agence: '3', nom: 'Agence Toamasina', ville: 'Toamasina' },
];
