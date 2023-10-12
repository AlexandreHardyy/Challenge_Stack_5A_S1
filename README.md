# RoadWise : Projet de Plateforme SaaS pour les Auto-Écoles

## Table des matières

- [RoadWise : Projet de Plateforme SaaS pour les Auto-Écoles](#roadwise--projet-de-plateforme-saas-pour-les-auto-écoles)
    - [Table des matières](#table-des-matières)
    - [Description](#description)
    - [Fonctionnalités](#fonctionnalités)
    - [Technologies](#technologies)
    - [Installation](#installation)
    - [Utilisation](#utilisation)
    - [Auteurs](#Auteurs)
    - [Contact](#contact)

## Description

Ce projet est le fruit du travail de quatre étudiants de l'ESGI en 5ᵉ année, spécialisés en Informatique et Web (IW).
L'objectif de ce projet est de développer une application SaaS qui facilite la gestion des réservations pour les
auto-écoles. La plateforme fournira aux auto-écoles un outil convivial pour la gestion des créneaux de plusieurs
établissements différents.

## Fonctionnalités

- Gestion des créneaux de réservation pour les leçons de conduite.
- Prise en charge de plusieurs établissements d'auto-école.
- Interface utilisateur réactive et intuitive en React.
- Backend solide et sécurisé basé sur API Platform.
- Authentification et autorisations des utilisateurs.
- Intégration de notifications et d'alertes pour les clients et les écoles.

## Technologies

- Front-end : React
- Back-end : API Platform
- Base de données : [Base de données de votre choix]
- Authentification : [Authentification (par exemple, JWT)]
- Langages de programmation : JavaScript, PHP
- Outils de développement : [Liste des principaux outils que vous utiliserez]

## Installation

Pour installer et exécuter cette application localement, suivez ces étapes :

1. Clonez le référentiel depuis GitHub.

   ```bash
   git clone https://github.com/votre-utilisateur/nom-du-projet.git
   ```

2. Installez les dépendances du front-end et du back-end.

   ```bash
   cd nom-du-projet
   cd front-end && npm install
   cd ../back-end && make install
   ```

3. Configurez la base de données et les paramètres d'environnement.

   ```bash
   cp .env.example .env
   ```

   Assurez-vous de configurer correctement les variables d'environnement dans les fichiers .env pour votre base de
   données et d'autres paramètres.

4. Exécutez l'application.

    - Pour le front-end :
       ```bash
       cd front-end && npm start
       ```

    - Pour le back-end :
       ```bash
       cd back-end && make start
       ```

5. Accédez à l'application dans votre navigateur à l'adresse http://localhost:3000.

6. (Facultatif) Exécutez les tests.

   ```bash
   cd back-end && php bin/phpunit
   ```

## Utilisation

Pour utiliser cette application, vous devrez peut-être créer un compte en tant qu'administrateur ou en tant qu'école.
Vous pouvez également vous connecter en tant qu'utilisateur pour réserver des leçons de conduite.

## Auteurs

- [Théo HERVE](https://github.com/theoherve)
- [Alexandre HARDY](https://github.com/AlexandreHardyy)
- [Armand DE FARIA LEITE](https://github.com/Iz0nite)
- [Noé PIGEAU](https://github.com/NoePigeau)

## Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter à l'adresse suivante : [theojherve@gmail.com]()