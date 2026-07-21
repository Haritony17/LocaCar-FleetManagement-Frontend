# 🚗 locaCar - Fleet Management

**locaCar** est une solution complète de gestion de flotte et de location de véhicules comprenant un **Front-office web**, une **Application mobile**, un **Back-office d'administration** et une plateforme backend reliée à une base de données **PostgreSQL**.

---

## 👥 Équipe de Développement
* **Haritony17**
* **kareemnoumenjanahary**

---

## 🛠️ Stack Technique

* **Base de données :** PostgreSQL (PSQL)
* **Backend :** API REST
* **Front-end Web :** Application Web (Client) & Back-Office (Admin)
* **Mobile :** Application Mobile (Client)
* **IoT / Services :** Suivi GPS en temps réel & Paiements Mobile Money (MVola, Orange Money)

---

## 🚀 Fonctionnalités Principales

### 1. 🌐 Espace Client (Web & Mobile)
* **Recherche & Réservation :** 
  * Recherche multicritère par agence, dates/heures et filtres (capacité, boîte de vitesse, carburant, tranche de prix).
  * Calcul automatique du tarif total et vitrine des véhicules populaires.
  * Fiche technique détaillée, galerie photos et avis des clients.
* **Tunnel de Réservation :**
  * Vérification administrative (Upload de permis de conduire et pièce d'identité).
  * Options de paiement : Mobile Money (MVola, Orange Money) ou Cash au guichet.
  * Génération de bon de réservation / contrat au format PDF.
* **Espace "Mon Compte" :**
  * Suivi du statut de validation des documents (KYC).
  * Gestion du cycle de vie des réservations (prolonger, reporter, annuler).
  * **Suivi GPS Live :** Carte interactive en temps réel affichant la position du véhicule et la distance parcourue pendant une location active.

---

### 2. ⚙️ Back-office d'Administration
* **Tableaux de bord (Dashboards) :**
  * **Suivi des Réservations :** Chiffre d'affaires, durée moyenne des réservations, répartition des statuts.
  * **Performances de la Flotte :** Top des véhicules les plus demandés, kilométrage cumulé, suivi des dépenses d'entretien.
* **Gestion de la Flotte (CRUD) :**
  * Gestion complète des fiches véhicules (carte grise, assurance, contrôle technique).
  * Tarifs dynamiques par véhicule avec tarif par défaut (fallback) par catégorie.
  * Modification des statuts véhicules (`DISPONIBLE`, `LOUEE`, `NETTOYAGE`, `EN_MAINTENANCE`) avec enregistrement de l'historique.
* **Suivi IoT & Cartographie GPS :**
  * Association des boîtiers GPS aux véhicules.
  * Visualisation en direct de toute la flotte sur carte interactive et replay de l'historique des trajets.
* **Gestion des Réservations & KYC :**
  * Validation/modération des documents clients.
  * Calculateur automatique des pénalités de retard/kilométrage lors de la restitution.
  * Enregistrement des coûts d'entretien et dépenses de maintenance.

---

## 🗄️ Base de Données

Le projet s'appuie sur une base de données **PostgreSQL**.

### Configuration de la BDD
1. Assurez-vous d'avoir PostgreSQL installé et démarré sur votre machine.
2. Créez la base de données :
   ```sql
   CREATE DATABASE locacar_db;