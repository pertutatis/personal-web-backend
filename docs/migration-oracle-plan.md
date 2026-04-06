# Plan: Migración de Vercel+Supabase a Oracle VM+Docker+PostgreSQL+Caddy

## Contexto

El free tier de Supabase da problemas: respuestas lentas y pausan el proyecto por inactividad. Se migra el backend + BD a una VM Oracle Cloud (always free) donde ya hay otro proyecto corriendo con Docker Compose. El frontend se queda en Netlify.

- **Subdominio:** `blog-api.diegopertusa.com`
- **Datos:** Hay que migrar datos existentes de Supabase
- **Docker:** Ya hay un Docker Compose en la VM para otro proyecto
- **Caddy:** Se instala como reverse proxy para gestionar SSL y ruteo de subdominios

---

## Cambios en el código

### 1. Arreglar Dockerfile para producción

**Archivo:** `Dockerfile`

- Usar multi-stage build para imagen más ligera
- Aprovechar `output: 'standalone'` de Next.js (ya configurado en next.config.js)
- Cambiar CMD de `npm run dev` → ejecutar standalone server
- Crear `.dockerignore` para excluir node_modules, .next, tests, .git, etc.

### 2. Crear docker-compose.prod.yml

**Archivo nuevo:** `docker-compose.prod.yml`

- Servicio `blog-api`: Next.js app (build desde Dockerfile)
- Servicio `blog-db`: PostgreSQL 16
- Red interna entre ambos
- Volume para persistencia de BD
- Variables de entorno via `.env` file
- Health checks en ambos servicios

### 3. Ajustar PostgresConnection para Oracle VM

**Archivo:** `src/contexts/shared/infrastructure/persistence/PostgresConnection.ts`

- Eliminar SSL forzado en producción (la BD está en localhost dentro de Docker, no necesita SSL)
- Subir max connections de 2 a 10 (ya no estamos limitados por Supabase pooler)
- Hacer configurable via env vars: `DB_MAX_CONNECTIONS`, `DB_SSL`

### 4. Añadir subdominio a CORS

**Archivo:** `src/contexts/blog/shared/infrastructure/security/CorsMiddleware.ts`

- Añadir `https://blog-api.diegopertusa.com` a ALLOWED_ORIGINS

### 5. Crear script de backup

**Archivo nuevo:** `scripts/backup-db.sh`

- `pg_dump` comprimido con rotación de 7 días
- Pensado para ejecutar con cron diario en la VM

### 6. Crear .env.production.example

**Archivo nuevo:** `.env.production.example`

- Template con todas las variables necesarias para producción

---

## Pasos manuales en la VM Oracle

### A. DNS

- Crear registro A: `blog-api.diegopertusa.com` → IP de la VM Oracle

### B. Firewall Oracle

- Abrir puertos 80 y 443 en Security List de la VCN (si no están abiertos ya para el otro proyecto)
- `sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT`
- `sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT`

### C. Instalar y configurar Caddy en la VM

- Caddy corre directamente en la VM (no en Docker), para gestionar certificados SSL de **todos** los subdominios
- El Caddyfile es **único a nivel de VM** (ej. `/etc/caddy/Caddyfile`), no pertenece a ningún proyecto individual
- Añadir el bloque de este proyecto al Caddyfile existente:
  ```
  blog-api.diegopertusa.com {
      reverse_proxy localhost:3001
  }
  ```
- Cada nuevo proyecto que se despliegue en la VM añade su propio bloque al mismo Caddyfile
- Recargar Caddy tras cambios: `sudo systemctl reload caddy`

### D. Migrar datos de Supabase

1. Exportar desde Supabase (connection string disponible en el dashboard):
   ```bash
   pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
     --data-only --no-owner --no-acl > supabase-data.sql
   ```
2. Importar en el PostgreSQL de Docker en la VM:
   ```bash
   docker exec -i blog-db psql -U postgres -d blog < supabase-data.sql
   ```

### E. Deploy

```bash
# Clonar repo en la VM
git clone [repo] ~/blog-api
cd ~/blog-api

# Crear .env con variables de producción (copiar de .env.production.example)
cp .env.production.example .env
# Editar .env con los valores reales

# Levantar servicios
docker compose -f docker-compose.prod.yml up -d --build

# Verificar
curl http://localhost:3001/api/health
```

### F. Backup automático

```bash
# Añadir al crontab
crontab -e
# Añadir línea:
0 3 * * * /home/ubuntu/blog-api/scripts/backup-db.sh
```

---

## Archivos a modificar/crear

| Acción     | Archivo                                                                |
| ---------- | ---------------------------------------------------------------------- |
| Reescribir | `Dockerfile`                                                           |
| Crear      | `.dockerignore`                                                        |
| Crear      | `docker-compose.prod.yml`                                              |
| Modificar  | `src/contexts/shared/infrastructure/persistence/PostgresConnection.ts` |
| Modificar  | `src/contexts/blog/shared/infrastructure/security/CorsMiddleware.ts`   |
| Crear      | `scripts/backup-db.sh`                                                 |
| Crear      | `.env.production.example`                                              |

---

## Verificación

1. **Local:** `docker compose -f docker-compose.prod.yml up --build` → `curl http://localhost:3001/api/health` devuelve `{"status":"ok"}`
2. **VM:** Tras deploy, `curl https://blog-api.diegopertusa.com/api/health` devuelve ok con certificado SSL válido
3. **CORS:** Verificar que el frontend en Netlify puede hacer requests al nuevo dominio
4. **Datos:** Verificar que los artículos/libros migrados son accesibles via API
5. **Backup:** Ejecutar `scripts/backup-db.sh` y verificar que genera el dump
