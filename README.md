# Tacos3V

Site de démo de commande de tacos : frontend statique (Nginx) + API Node.js/Express, déployés avec Docker.

```
Frontend/   index.html + nginx.conf (proxy /api/ vers le backend)
Backend/    index.js + menu.json (GET /api/menu, POST /api/orders, GET /api/health)
docker-compose-prod.yml   reverse proxy + SSL + backend + frontend
```

## Prérequis

- Un VPS avec Docker et Docker Compose.
- Un enregistrement DNS `A` de `tacos3v.jnbvnt.fr` vers l'IP du VPS.
- Ports 80 et 443 ouverts.

## Installation

```bash
git clone https://github.com/Axelb31/Tacos3V.git
cd Tacos3V
```

Dans `docker-compose-prod.yml`, remplacez `DEFAULT_EMAIL` par votre adresse e-mail. Si besoin, changez aussi le domaine dans `VIRTUAL_HOST` et `LETSENCRYPT_HOST`.

## Déploiement

```bash
docker compose -f docker-compose-prod.yml up -d --build
```

Vérification :

```bash
docker compose -f docker-compose-prod.yml ps
curl -k https://tacos3v.jnbvnt.fr/api/health
```

`-k` est nécessaire tant que le certificat de staging est utilisé (voir plus bas).

Mise à jour après un `git pull` : relancez la même commande `up -d --build`.

## Certificat SSL

Le conteneur `nginx-proxy-acme` génère et renouvelle le certificat automatiquement, au démarrage, en 1 à 2 minutes. Il faut que le DNS pointe vers le VPS et que le port 80 soit ouvert.

Par défaut, il utilise le serveur **staging** de Let's Encrypt (`ACME_CA_URI` dans `docker-compose-prod.yml`). Le staging n'a pas de limite de quota, mais le navigateur affiche un avertissement de sécurité.

Pour obtenir un vrai certificat :

1. Supprimez la ligne `ACME_CA_URI` dans `docker-compose-prod.yml`.
2. Supprimez l'ancien certificat de test et relancez :

```bash
docker compose -f docker-compose-prod.yml down
docker volume rm tacos3v_certs tacos3v_acme
docker compose -f docker-compose-prod.yml up -d
```

Le nom exact des volumes s'affiche avec `docker volume ls`.

Suivre la génération :

```bash
docker compose -f docker-compose-prod.yml logs -f nginx-proxy-acme
```

## Logs

```bash
docker compose -f docker-compose-prod.yml logs -f backend frontend
```
