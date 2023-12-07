# Challenge-S2

[Consignes](https://amorin.notion.site/4J-S2-NodeJs-MongoDB-VueJS-Droit-RGPD-5ee13148905e427b919efced2eda0998)


## Installation

1. Cloner le projet: https://github.com/mhd-zaid/Challenge-S2.git avec la commande suivante:
```bash
git clone https://github.com/mhd-zaid/Challenge-S2.git
```

2. Créer un fichier .env.local avec le code qui vous a été envoyé 

3. Ouvrir docker puis exécuter la commande suivante:
```bash
docker-compose up -d
```

4. Pour exécuter les fixtures et avoir des données de test utilisez la commande suivante:
```bash
docker compose exec api npm run fixtures:load
```
5. Pour exécuter les migrations utilisez la commande suivante:
```bash
docker compose exec api npm run migrate:schema
```

6. Pour exécuter les tests utilisez la commande suivante:
```bash
docker compose exec api npm run test
```


## Comptes pour les tests

Le mot de passe pour tous les comptes qui suivent est `test`

Les différents emails sont les suivants:

- ROLE_USER
    - user@user.fr
    - userdemo1@user.fr
    - userdemo2@user.fr

- ROLE_ADMIN
    - admin@user.fr
    - admindemo1@user.fr
    - admindemo2@user.fr


## Usage

- Client
    - Se rendre sur le lien suivant: http://localhost:5173

- Dashboard
    - Se rendre sur le lien suivant: http://localhost:5174

- API
    - Exécuter les requête back sur : http://localhost:3000

- Accès aux bases de données
    - Adminer
        - Lien de connexion : http://localhost:8081/postgres://user:challenge-s2@postgresdb:5432/SneakPeak?pgsql=postgresdb&username=user&db=SneakPeak&ns=public
        - Connexion avec l'identifiant `user` et le mot de passe `challenge-s2` pour la base mysqldb

    - Mongo
        - Lien de connexion : `mongodb://root:challenge-s2@mongodb/challenge-s2?authMechanism=DEFAULT`
        - Conexion avec l'identifiant `root` et le mot de passe `challenge-s2` pour la base mongodb

Pour effectuer la mise à jours des statuts des commandes, il faut exécuter la commande suivante afin de déclencher les webhooks:
```bash
stripe listen --forward-to localhost:3000/payments/success
stripe listen --forward-to localhost:3000/payments/failed
```

Les informations de connexion pour le compte stripe et le fichier .env.local seront transmis via la plateforme de rendu de projet.

