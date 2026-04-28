# 🚀 TechShop Premium - Projet DevOps Groupe 5

Bienvenue dans **TechShop Premium**, une plateforme d'e-commerce moderne conçue avec une architecture robuste et des pratiques DevOps de pointe.

## 🌟 Fonctionnalités

### 🛒 Boutique Client
- **Design Futuriste** : Interface sombre (Deep Tech) avec effets de lueur et glassmorphism.
- **Catalogue Dynamique** : Recherche en temps réel et filtrage par catégorie.
- **Panier Persistant** : Gestion fluide des achats avec notifications visuelles.
- **Authentification Sécurisée** : Connexion classique et Google Auth.
- **Checkout Immersif** : Processus de paiement simulé avec génération de facture.

### 🛡️ Administration
- **Dashboard KPI** : Visualisation des ventes, revenus et statistiques utilisateurs.
- **Gestion CRUD Complète** : Contrôle total sur les produits et les catégories.
- **Upload d'Images local** : Support du Drag & Drop pour les images produits.
- **Sécurité** : Interface réservée aux administrateurs.

---

## 🏗️ Architecture Technique

Le projet repose sur une stack **Full-Stack Dockerisée** :

- **Frontend** : [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [TailwindCSS](https://tailwindcss.com/)
- **Backend** : [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Base de Données** : [PostgreSQL](https://www.postgresql.org/)
- **Gestion DB** : [pgAdmin 4](https://www.pgadmin.org/)
- **Serveur Statique** : Nginx (pour le build frontend)

---

## 🛠️ Guide d'Installation

### Prérequis
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) installés.
- Un navigateur moderne.

### Lancement Rapide
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Dominique12345678/projet-finale--devops-groupe-5.git
   cd mon-projet-devops
   ```

2. Démarrez l'application :
   ```bash
   docker-compose up --build
   ```

3. Accédez aux services :
   - **Frontend** : `http://localhost:3000`
   - **Backend (API)** : `http://localhost:8000`
   - **Documentation API (Swagger)** : `http://localhost:8000/docs`
   - **pgAdmin** : `http://localhost:5050` (Email: `admin@admin.com`, Pass: `admin`)

---

## 🔐 Accès Administrateur

Un compte administrateur est automatiquement créé au premier démarrage :
- **Email** : `admin@techshop.com`
- **Mot de passe** : `adminpassword`

---

## 📑 Documentation API

L'API est documentée automatiquement via **Swagger**. Une fois le backend lancé, visitez `/docs` pour :
- Tester les endpoints.
- Voir les schémas de données (Pydantic).
- Comprendre les interactions CRUD.

---

## 📐 Décisions Techniques & DevOps

1. **Dockerisation** : Chaque service est isolé dans un conteneur pour garantir la parité entre les environnements de développement et de production.
2. **Auto-seeding** : La base de données s'auto-initialise avec des données de test pour une expérience "Prêt à l'emploi".
3. **Persistance** : Utilisation de volumes Docker pour les données PostgreSQL et les images uploadées.
4. **Sécurité** : Implémentation d'un middleware CORS flexible et gestion des rôles (Admin/User).

---

## 👥 Équipe - Groupe 5
Projet réalisé dans le cadre du Bachelor B3SI - Processus DevOps.
