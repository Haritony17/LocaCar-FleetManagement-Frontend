import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '220px', background: '#1e293b', color: 'white', padding: '1rem' }}>
        <h2>Back-office</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/admin/dashboard" style={{ color: 'white' }}>Dashboard</Link>
          <Link to="/admin/flotte" style={{ color: 'white' }}>Gestion Flotte</Link>
          <Link to="/admin/reservations" style={{ color: 'white' }}>Réservations</Link>
          <Link to="/admin/kyc" style={{ color: 'white' }}>Vérification KYC</Link>
          <Link to="/admin/gps" style={{ color: 'white' }}>Suivi GPS</Link>
          <Link to="/admin/paiements" style={{ color: 'white' }}>Paiements</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}