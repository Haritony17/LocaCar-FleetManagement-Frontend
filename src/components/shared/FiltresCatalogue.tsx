export interface Filtres {
  places: number | null;
  boite: string | null;
  motorisation: string | null;
  prixMax: number;
}

interface Props {
  filtres: Filtres;
  onChange: (filtres: Filtres) => void;
}

export default function FiltresCatalogue({ filtres, onChange }: Props) {
  return (
    <aside style={{
      width: '220px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      padding: '1rem',
      borderRight: '1px solid #e2e8f0',
    }}>
      <h3 style={{ margin: 0 }}>Filtres</h3>

      <div>
        <label>Capacité (places)</label>
        <select
          value={filtres.places ?? ''}
          onChange={(e) => onChange({ ...filtres, places: e.target.value ? Number(e.target.value) : null })}
          style={{ width: '100%', padding: '0.4rem', marginTop: '0.25rem' }}
        >
          <option value="">Toutes</option>
          <option value="2">2 places</option>
          <option value="5">5 places</option>
          <option value="7">7 places</option>
        </select>
      </div>

      <div>
        <label>Boîte de vitesse</label>
        <select
          value={filtres.boite ?? ''}
          onChange={(e) => onChange({ ...filtres, boite: e.target.value || null })}
          style={{ width: '100%', padding: '0.4rem', marginTop: '0.25rem' }}
        >
          <option value="">Toutes</option>
          <option value="Manuelle">Manuelle</option>
          <option value="Automatique">Automatique</option>
        </select>
      </div>

      <div>
        <label>Motorisation</label>
        <select
          value={filtres.motorisation ?? ''}
          onChange={(e) => onChange({ ...filtres, motorisation: e.target.value || null })}
          style={{ width: '100%', padding: '0.4rem', marginTop: '0.25rem' }}
        >
          <option value="">Toutes</option>
          <option value="Essence">Essence</option>
          <option value="Diesel">Diesel</option>
          <option value="Electrique">Électrique</option>
          <option value="Hybride">Hybride</option>
        </select>
      </div>

      <div>
        <label>Prix max : {filtres.prixMax} $/jour</label>
        <input
          type="range"
          min={20}
          max={100}
          step={5}
          value={filtres.prixMax}
          onChange={(e) => onChange({ ...filtres, prixMax: Number(e.target.value) })}
          style={{ width: '100%', marginTop: '0.25rem' }}
        />
      </div>

      <button
        onClick={() => onChange({ places: null, boite: null, motorisation: null, prixMax: 100 })}
        style={{ padding: '0.5rem', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Réinitialiser
      </button>
    </aside>
  );
}