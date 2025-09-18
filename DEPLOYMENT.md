# 🚀 Guide de Déploiement - Teal Technology Services

## 📋 Prérequis

- Node.js 18+ installé
- npm ou yarn
- Compte Netlify gratuit

## 🛠️ Préparation du Déploiement

### 1. Build de Production
```bash
cd frontend
npm install
npm run build
```

### 2. Test Local du Build
```bash
npx serve -s build
```
L'application sera accessible sur http://localhost:3000

## 🌐 Déploiement sur Netlify (Recommandé)

### Option A : Déploiement par Drag & Drop
1. Aller sur [netlify.com](https://netlify.com)
2. Créer un compte gratuit
3. Faire glisser le dossier `build/` sur la zone de déploiement
4. Votre site sera en ligne en quelques secondes !

### Option B : Déploiement via Git (Automatique)
1. Pousser le code sur GitHub
2. Connecter le repository à Netlify
3. Configuration automatique détectée grâce à `netlify.toml`
4. Déploiement automatique à chaque push

### Option C : Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

## 🔧 Configuration Netlify

Le fichier `netlify.toml` configure automatiquement :
- ✅ Redirections pour React Router
- ✅ Headers de sécurité
- ✅ Cache des assets
- ✅ Variables d'environnement

## 🌍 Autres Options de Déploiement Gratuit

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
1. Installer gh-pages : `npm install --save-dev gh-pages`
2. Ajouter dans package.json :
   ```json
   "homepage": "https://username.github.io/repository-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Déployer : `npm run deploy`

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📊 Fonctionnalités Déployées

✅ **Application React complète**
✅ **Persistance localStorage** (pas besoin de base de données)
✅ **4 rôles utilisateur** (Admin, RH, Manager, Employé)
✅ **Gestion complète** (Employés, Objectifs, Formations, Congés)
✅ **Interface moderne** avec TailwindCSS
✅ **Responsive design**
✅ **PWA ready**

## 🔐 Comptes de Test

Une fois déployé, utilisez ces comptes :
- **Admin** : admin@teal-tech.com / password123
- **RH** : hr@teal-tech.com / password123
- **Manager** : manager@teal-tech.com / password123
- **Employé** : employee@teal-tech.com / password123

## 🎯 URLs Recommandées

- **Netlify** : `teal-technology-services.netlify.app`
- **Vercel** : `teal-technology-services.vercel.app`
- **Custom** : Votre propre domaine

## 🔍 Vérifications Post-Déploiement

1. ✅ Page de connexion accessible
2. ✅ Authentification fonctionnelle
3. ✅ Navigation entre les rôles
4. ✅ Persistance des données
5. ✅ Responsive design
6. ✅ Performance (Lighthouse > 90)

## 🆘 Dépannage

### Erreur 404 sur les routes
- Vérifier que `netlify.toml` est présent
- Vérifier les redirections SPA

### Données non sauvegardées
- Vérifier localStorage dans DevTools
- Tester en mode incognito

### Performance lente
- Vérifier la compression gzip
- Optimiser les images
- Utiliser le cache des assets

## 📞 Support

En cas de problème, vérifiez :
1. Console du navigateur (F12)
2. Network tab pour les erreurs
3. Logs de déploiement sur Netlify

---

**🎉 Votre application Teal Technology Services est prête pour le déploiement !**
