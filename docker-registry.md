# Docker Registry

## Conceptos clave

- Un registry es un almacen de imagenes versionadas por **tags** (`mtg-app:1.0.0`, `mtg-app:1.1.0`).
- `latest` es solo un tag convencional, **no se actualiza solo**. Hay que pushearlo explicitamente.
- Todas las versiones pusheadas se conservan y puedes hacer rollback instantaneo.
- `docker compose up -d` **no hace pull automaticamente**. Usar `docker compose pull && docker compose up -d`.

---

## Instalacion self-hosted (en servidor)

### Basico

```bash
mkdir -p /opt/registry/{data,certs,auth}

docker run -d \
  --name registry \
  --restart unless-stopped \
  -p 5000:5000 \
  -v /opt/registry/data:/var/lib/registry \
  registry:2
```

### Con TLS (produccion)

```bash
# Copiar certificados SSL de tu dominio (ej: registry.tudominio.com)
cp fullchain.pem privkey.pem /opt/registry/certs/

docker run -d \
  --name registry \
  --restart unless-stopped \
  -p 5000:5000 \
  -v /opt/registry/data:/var/lib/registry \
  -v /opt/registry/certs:/certs \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/fullchain.pem \
  -e REGISTRY_HTTP_TLS_KEY=/certs/privkey.pem \
  registry:2
```

### Con TLS + autenticacion

```bash
# Crear usuario
docker run --rm --entrypoint htpasswd httpd:2 -Bbn TU_USUARIO TU_PASSWORD > /opt/registry/auth/htpasswd

docker run -d \
  --name registry \
  --restart unless-stopped \
  -p 5000:5000 \
  -v /opt/registry/data:/var/lib/registry \
  -v /opt/registry/certs:/certs \
  -v /opt/registry/auth:/auth \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/fullchain.pem \
  -e REGISTRY_HTTP_TLS_KEY=/certs/privkey.pem \
  -e REGISTRY_AUTH=htpasswd \
  -e REGISTRY_AUTH_HTPASSWD_REALM="MTG Registry" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  registry:2
```

---

## Comandos de uso diario

```bash
# Login
docker login registry.tudominio.com:5000          # self-hosted
docker login ghcr.io -u TU_USUARIO                # GitHub
docker login -u TU_USUARIO                         # Docker Hub

# Build
docker build -t mtg-app:1.0.0 -f Dockerfile .
docker build -t mtg-sync:1.0.0 -f docker/sync/Dockerfile .

# Tag (sustituir REGISTRY por el tuyo)
docker tag mtg-app:1.0.0 REGISTRY/mtg-app:1.0.0
docker tag mtg-app:1.0.0 REGISTRY/mtg-app:latest

# Push
docker push REGISTRY/mtg-app:1.0.0
docker push REGISTRY/mtg-app:latest

# Pull + deploy
docker compose pull && docker compose up -d

# Rollback a version anterior
# Cambiar tag en docker-compose.yml a la version deseada, luego:
docker compose pull && docker compose up -d
```

---

## Consultar imagenes almacenadas

```bash
# Self-hosted
curl -u USER:PASS https://registry.tudominio.com:5000/v2/_catalog
curl -u USER:PASS https://registry.tudominio.com:5000/v2/mtg-app/tags/list

# ghcr.io (requiere gh CLI)
gh api user/packages/container/mtg-app/versions --jq '.[].metadata.container.tags'

# Local
docker images | grep mtg
```

---

## Uso en docker-compose

Reemplazar `build:` por `image:` para usar imagenes del registry:

```yaml
services:
  mtg-app:
    image: REGISTRY/mtg-app:latest
    # ... resto igual

  mtg-sync:
    image: REGISTRY/mtg-sync:latest
    # ... resto igual
```

---

## Registries compatibles (todos usan API v2 estandar)

| Registry | Tier gratuito | Integracion nativa |
|----------|---------------|--------------------|
| **Docker Hub** | 1 repo privado, publicos ilimitados | GitHub, Bitbucket, GitLab |
| **ghcr.io** | Ilimitado publico, 500 MB privado | GitHub Actions |
| **AWS ECR** | 500 MB/mes (12 meses) | Bitbucket Pipes, GitHub Actions |
| **Google Artifact Registry** | 500 MB | Bitbucket Pipes, GitHub Actions |
| **GitLab Container Registry** | 5 GB | GitLab CI |
| **Self-hosted (registry:2)** | Ilimitado | Cualquier CI con `docker login` |
| **Harbor** | Self-hosted, gratuito | Cualquier CI (incluye UI y escaneo) |

> Todos son intercompatibles. `docker login` + `docker push` funciona igual contra cualquiera.

### Ejemplo Bitbucket Pipelines

```yaml
pipelines:
  branches:
    master:
      - step:
          services: [docker]
          script:
            - docker login -u $REGISTRY_USER -p $REGISTRY_PASS REGISTRY
            - docker build -t REGISTRY/mtg-app:$BITBUCKET_BUILD_NUMBER .
            - docker push REGISTRY/mtg-app:$BITBUCKET_BUILD_NUMBER
```

---

## Buenas practicas

- Etiquetar siempre con **version semantica** ademas de `latest`
- No subir secretos en las imagenes — usar variables de entorno en runtime
- Limpiar imagenes antiguas periodicamente
- Escanear vulnerabilidades antes de push: `docker scout cves mtg-app:latest`
