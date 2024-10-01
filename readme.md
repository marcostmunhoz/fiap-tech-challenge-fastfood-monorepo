# FIAP Tech Challenge - Monorepo

## Usage

```bash
docker compose up -d
```

## Deploying the infrastructure

```bash
cd terraform
cp .env.example .env # Then set the ENCRYPTION_KEY value
./apply.sh
```
