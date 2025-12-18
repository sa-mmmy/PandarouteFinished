# PandaRoute 🐼

PandaRoute est une application web éco-responsable permettant d'estimer le coût en CO₂ de vos trajets selon différents moyens de transport en France. Elle vous propose une interface simple et intuitive pour comparer vos itinéraires et adopter une démarche plus durable.

## 🚀 Fonctionnalités principales

- Calcul du coût en CO₂ d’un trajet entre deux points en France
- Utilisation de l’API Impact CO₂ et des données https://transport.data.gouv.fr/
- Affichage de l’itinéraire via Google Maps
- Interface responsive et accessible
- Création de compte utilisateur
- Historique des trajets et statistiques associées

## 📦 Installation

Cloner le projet :
```bash
git clone https://forge.univ-lyon1.fr/m1if10-09-2024/m1if10-09-2024.git
cd m1if10-09-2024
```

Installer les dépendances :
```bash
npm install
```

Démarrer le serveur de développement :
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🛠 Technologies utilisées

- [Next.js](https://nextjs.org/)
- [Node.js](https://nodejs.org/)
- [Google Maps API](https://developers.google.com/maps)
- [Impact CO₂ API](https://www.data.gouv.fr/fr/datasets/api-impact-co2/)
- [Transport.data.gouv.fr](https://transport.data.gouv.fr/)
- PostgreSQL pour la base de données
- CI/CD via GitLab
- Déploiement sur une VM Ubuntu

## 👥 Équipe

Projet réalisé dans le cadre du Master IF.  
Membres de l'équipe :

- BD : Khalissa RHOULAM khalissa.rhoulam@etu.univ-lyon1.fr 06 52 49 65 77
- VM : Nael LAHCENE nael.lahcene@etu.univ-lyon1.fr 07 82 13 65 78
- Front : Niama CHIBANI niama.chibani@etu.univ-lyon1.fr 07 67 97 23 56
- Front : Mael LAURENT mael.laurent@etu.univ-lyon1.fr 07 67 86 28 18
- Reporter : Yannis BORDJI yannis.bordji@etu.univ-lyon1.fr 06 52 64 20 18
- Back : Anthony BOVE anthony.bove@etu.univ-lyon1.fr 07 82 21 59 45

## ✅ Tests utilisateurs

Des tests ont été réalisés sur un panel de 10 personnes réparties par tranche d’âge.  
Résultats :

- Groupe 50–65 ans : police trop petite et contraste à améliorer
- Groupes 18–23 ans et 14–17 ans : expérience claire et fonctionnelle
- Suggestions : ajout d’un système de récapitulatif des trajets ("rewind")

## ⚙️ Déploiement

Le déploiement se fait via GitLab CI/CD sur une VM (Ubuntu).  
La configuration du proxy, la base de données et l'environnement Node sont prévus dans les scripts `setup.sh`.


## 📄 Licence

Ce projet est un travail universitaire. Tous droits réservés © 2024-2025.