# Guide de Déploiement AWS

Ce guide explique comment déployer votre application Full-Stack (FastAPI + React + PostgreSQL) sur AWS en utilisant Terraform et GitHub Actions.

## 1. Prérequis
- Un compte AWS avec les accès Administrateur.
- AWS CLI installé localement.
- Terraform installé localement.
- GitHub Secrets configurés (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).

## 2. Infrastructure (Terraform)
L'infrastructure utilise :
- **VPC** : Réseau isolé avec sous-réseaux publics et privés.
- **RDS (PostgreSQL)** : Base de données gérée.
- **ECR** : Registre d'images Docker.
- **ECS Fargate** : Pour exécuter les containers sans gérer de serveurs.
- **ALB (Application Load Balancer)** : Pour router le trafic vers le frontend et l'API.

### Étapes pour créer l'infrastructure :
1. Allez dans le dossier terraform :
   ```bash
   cd infrastructure/terraform
   ```
2. Initialisez Terraform :
   ```bash
   terraform init
   ```
3. Créez un fichier `terraform.tfvars` pour vos variables sensibles :
   ```hcl
   db_password = "votre_mot_de_passe_secret"
   ```
4. Déployez l'infrastructure :
   ```bash
   terraform apply
   ```
   *Note : Cela peut prendre environ 10-15 minutes (principalement pour la base de données RDS).*

## 3. Pipeline CI/CD (GitHub Actions)
Une fois l'infrastructure créée, le pipeline s'occupe de tout le reste :
1. **CI** : Teste le backend et le frontend.
2. **CD** : 
   - Se connecte à AWS ECR.
   - Build les images Docker du backend et du frontend.
   - Pousse les images vers ECR.
   - Déclenche un redéploiement sur ECS pour mettre à jour l'application.

## 4. Accès à l'application
Une fois le premier pipeline terminé, Terraform affichera l'URL de votre Load Balancer (`alb_dns_name`).
Vous pourrez accéder à votre application via cette URL.

L'ALB est configuré pour router :
- Les requêtes `/api/*` vers le backend.
- Toutes les autres requêtes vers le frontend.
