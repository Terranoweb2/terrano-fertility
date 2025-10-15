
# 🌸 Terrano Fertility

Application complète de gestion de fertilité et suivi de cycle menstruel développée avec Next.js 14, TypeScript et Prisma.

![Terrano Fertility](./nextjs_space/public/logo.png)

## 🌟 Fonctionnalités principales

### 📊 Tableau de bord
- Vue d'ensemble du cycle actuel
- Graphiques interactifs de suivi
- Prédictions de fertilité basées sur l'IA
- Statistiques détaillées

### 📅 Suivi du cycle
- Enregistrement des cycles menstruels
- Suivi des symptômes quotidiens
- Calendrier interactif avec indicateurs visuels
- Prédiction des prochaines périodes

### 🤖 FertiliBot - Assistant IA
- Chatbot intelligent spécialisé en fertilité
- Réponses personnalisées aux questions
- Conseils et recommandations
- Historique des conversations

### 🤰 Suivi de grossesse
- Tracker de semaines de grossesse
- Gestion des rendez-vous médicaux
- Suivi de l'évolution
- Checklist personnalisée

### ⏰ Rappels intelligents
- Rappels de prise de pilule/médicaments
- Notifications de cycle
- Rendez-vous médicaux
- Personnalisation complète

### 📚 Contenu éducatif
- Articles sur la fertilité
- Guides et conseils
- Information sur la santé reproductive
- Ressources vérifiées

### ⚙️ Paramètres avancés
- Profil utilisateur complet
- Photo de profil avec upload cloud
- Changement de mot de passe sécurisé
- Préférences personnalisées
- Notifications configurables
- Thème clair/sombre
- Export de données

## 🛠️ Technologies utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne et responsive
- **Shadcn UI** - Composants UI élégants
- **React Hook Form** - Gestion des formulaires
- **Recharts** - Graphiques interactifs

### Backend
- **Next.js API Routes** - API RESTful
- **Prisma** - ORM pour la base de données
- **PostgreSQL** - Base de données relationnelle
- **NextAuth.js** - Authentification sécurisée
- **bcrypt** - Hash des mots de passe

### Cloud & Storage
- **AWS S3** - Stockage cloud des images
- **Vercel** - Déploiement et hosting

## 🚀 Installation locale

### Prérequis
- Node.js 18+ 
- Yarn
- PostgreSQL
- Compte AWS (pour le stockage des images)

### Configuration

1. **Cloner le dépôt**
```bash
git clone https://github.com/Terranoweb2/terrano-fertility.git
cd terrano-fertility
```

2. **Installer les dépendances**
```bash
cd nextjs_space
yarn install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` dans `nextjs_space/` :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/terrano_fertility"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-aleatoire-ici"

# AWS S3 (pour l'upload d'images)
AWS_BUCKET_NAME="votre-bucket-s3"
AWS_FOLDER_PREFIX="terrano-fertility/"
AWS_ACCESS_KEY_ID="votre-access-key"
AWS_SECRET_ACCESS_KEY="votre-secret-key"
AWS_REGION="us-east-1"
```

4. **Configurer la base de données**
```bash
cd nextjs_space
yarn prisma generate
yarn prisma db push
```

5. **Lancer l'application**
```bash
yarn dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🔒 Sécurité

- ✅ Authentification sécurisée avec NextAuth.js
- ✅ Hash des mots de passe avec bcrypt
- ✅ Protection CSRF
- ✅ Validation des données côté serveur
- ✅ Sessions sécurisées
- ✅ Upload sécurisé sur S3

## 📊 Structure du projet

```
terrano-fertility/
├── nextjs_space/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   ├── auth/             # Pages d'authentification
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── calendar/         # Calendrier de suivi
│   │   ├── symptoms/         # Gestion des symptômes
│   │   ├── reminders/        # Système de rappels
│   │   ├── education/        # Contenu éducatif
│   │   ├── statistics/       # Statistiques et graphiques
│   │   ├── settings/         # Paramètres utilisateur
│   │   └── layout.tsx        # Layout principal
│   ├── components/           # Composants réutilisables
│   ├── lib/                  # Utilitaires et configuration
│   ├── prisma/               # Schéma de base de données
│   └── public/               # Assets statiques
└── README.md
```

## 🎨 Thème et Design

- Design moderne avec dégradés rose-violet
- Mode sombre/clair
- Animations fluides avec Framer Motion
- Interface intuitive et accessible
- Icônes Lucide React

## 📝 Modèle de données

### Principales entités
- **User** - Utilisateurs avec authentification
- **Cycle** - Cycles menstruels
- **Symptom** - Symptômes quotidiens
- **Reminder** - Rappels et notifications
- **Pregnancy** - Suivi de grossesse
- **ChatMessage** - Historique du chatbot

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée.

## 👥 Auteur

**Terranoweb2**
- GitHub: [@Terranoweb2](https://github.com/Terranoweb2)

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

## 🎉 Remerciements

- Next.js team pour le framework incroyable
- Vercel pour l'hébergement
- Shadcn pour les composants UI
- La communauté open source

---

Développé avec ❤️ pour aider les femmes à mieux comprendre leur fertilité
