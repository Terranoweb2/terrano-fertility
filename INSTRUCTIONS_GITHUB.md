
# 📤 Instructions pour pousser votre code vers GitHub

## ⚠️ Problème actuel

Le token OAuth actuel n'a pas les permissions nécessaires pour pousser du code vers votre dépôt GitHub. Vous devez créer un **Personal Access Token (PAT)** avec les bonnes permissions.

## 🔑 Créer un Personal Access Token

### Étape 1 : Créer le token
1. Allez sur : [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)
2. Connectez-vous si nécessaire
3. Donnez un nom au token : `Terrano Fertility Deploy`
4. Sélectionnez l'expiration : `90 days` (ou selon votre préférence)
5. Cochez les permissions suivantes :
   - ✅ **repo** (Full control of private repositories)
     - Cela inclut : repo:status, repo_deployment, public_repo, repo:invite, security_events
6. Cliquez sur **Generate token** en bas de la page
7. **⚠️ IMPORTANT** : Copiez immédiatement le token généré (il ne sera plus visible après !)

### Étape 2 : Utiliser le token pour pousser le code

Une fois le token créé, exécutez cette commande en remplaçant `VOTRE_TOKEN` par le token que vous avez copié :

```bash
cd /home/ubuntu/gestion_fertilite
./push-to-github.sh VOTRE_TOKEN
```

## 🎯 Alternative : Push manuel

Si vous préférez faire le push manuellement :

```bash
cd /home/ubuntu/gestion_fertilite

# Supprimer l'ancien remote
git remote remove origin

# Ajouter le nouveau remote avec votre token
git remote add origin https://VOTRE_TOKEN@github.com/Terranoweb2/terrano-fertility.git

# Pousser le code
git push -u origin master
```

## 📊 État actuel du projet

- **Dépôt GitHub** : [https://github.com/Terranoweb2/terrano-fertility](https://github.com/Terranoweb2/terrano-fertility)
- **Branche** : master
- **Dernier commit** : Fonctionnalité changement mot de passe implémentée
- **Fichiers prêts** : Tous les fichiers sont commités et prêts à être poussés

## ❓ Questions fréquentes

### Q : Le token est-il sécurisé ?
R : Oui, mais :
- Ne le partagez jamais publiquement
- Ne le commitez jamais dans Git
- Utilisez-le uniquement pour des opérations automatisées

### Q : Que faire si j'ai perdu mon token ?
R : Retournez sur [https://github.com/settings/tokens](https://github.com/settings/tokens) et créez-en un nouveau.

### Q : Puis-je utiliser SSH au lieu de HTTPS ?
R : Oui ! Si vous avez configuré une clé SSH :

```bash
cd /home/ubuntu/gestion_fertilite
git remote remove origin
git remote add origin git@github.com:Terranoweb2/terrano-fertility.git
git push -u origin master
```

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que le token a bien les permissions `repo`
2. Vérifiez que le dépôt existe sur GitHub
3. Vérifiez que vous êtes bien le propriétaire du dépôt ou que vous avez les droits d'écriture

---

✨ **Votre application Terrano Fertility est prête à être partagée sur GitHub !**
