import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ClientLayout from '../layouts/ClientLayout';

import Accueil from '../pages/public/Accueil';
import Login from '../pages/public/Login';
import Catalogue from '../pages/public/Catalogue';
import VehiculeDetails from '../pages/public/VehiculeDetails';
import Register from '../pages/public/Register';

import Profil from '../pages/client/Profil';
import MesReservations from '../pages/client/MesReservations';
import SuiviGPSClient from '../pages/client/SuiviGPSClient';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/login" element={<Login />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/vehicule/:id" element={<VehiculeDetails />} />
      <Route path="/register" element={<Register />} />

      
  

      <Route
        path="/mon-compte"
        element={
          <ProtectedRoute role="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MesReservations />} />
        <Route path="profil" element={<Profil />} />
        <Route path="reservations" element={<MesReservations />} />
        <Route path="gps" element={<SuiviGPSClient />} />
      </Route>
    </Routes>
  );
}