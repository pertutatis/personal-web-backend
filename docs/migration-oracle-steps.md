# Guía de deploy: Oracle VM

Pasos para desplegar el backend en la VM Oracle Cloud. Ejecutar en orden.

---

## 1. DNS

Crear registro A en tu proveedor de DNS:

```
blog-api.diegopertusa.com → <IP_VM_ORACLE>
```

Verificar propagación:

```bash
dig blog-api.diegopertusa.com +short
```

---

## 2. Firewall Oracle

### En la consola de Oracle Cloud

Ir a **Networking > Virtual Cloud Networks > tu VCN > Security Lists** y añadir reglas de ingress para los puertos 80 y 443 (TCP, source 0.0.0.0/0). Saltar si ya están abiertos para otro proyecto.

### En la VM

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

> Oracle Linux usa `firewalld`. Si no está activo, las reglas de iptables directas también sirven, pero `firewalld` es lo estándar.

---

## 3. Instalar Caddy

```bash
sudo dnf install -y 'dnf-command(copr)'
sudo dnf copr enable -y @caddy/caddy
sudo dnf install -y caddy
sudo systemctl enable caddy
```

Configurar `/etc/caddy/Caddyfile` con ambos proyectos:

```
assistant.diegopertusa.com {
    reverse_proxy localhost:3030
}

blog-api.diegopertusa.com {
    reverse_proxy localhost:3001
}
```

```bash
sudo systemctl reload caddy
```

Caddy se encarga automáticamente de obtener y renovar el certificado SSL via Let's Encrypt.

---

## 4. Clonar y configurar el proyecto

```bash
git clone <REPO_URL> ~/blog-api
cd ~/blog-api

cp .env.production.example .env
```

Editar `.env` con los valores reales:

```bash
nano .env
```

Valores a cambiar:

- `DB_PASSWORD` — contraseña segura para PostgreSQL
- `API_URL` — verificar que sea `https://blog-api.diegopertusa.com`

---

## 5. Levantar servicios

```bash
cd ~/blog-api
docker compose -f docker-compose.prod.yml up -d --build
```

Verificar que ambos contenedores están healthy:

```bash
docker compose -f docker-compose.prod.yml ps
```

Test rápido:

```bash
curl http://localhost:3001/api/health
# Esperado: {"status":"ok"}
```

---

## 6. Migrar datos de Supabase

### Exportar desde Supabase

Desde cualquier máquina con `pg_dump` instalado (puede ser local o la propia VM):

```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  --data-only --no-owner --no-acl > supabase-data.sql
```

> La connection string está en el dashboard de Supabase: **Settings > Database > Connection string**.

### Importar en la VM

Si exportaste en local, primero sube el archivo:

```bash
scp supabase-data.sql ubuntu@<IP_VM>:~/supabase-data.sql
```

Importar:

```bash
docker exec -i blog-db psql -U postgres -d blog < ~/supabase-data.sql
```

---

## 7. Verificación completa

```bash
# 1. Health check local
curl http://localhost:3001/api/health

# 2. Health check con SSL (tras DNS + Caddy)
curl https://blog-api.diegopertusa.com/api/health

# 3. Verificar que los datos migrados son accesibles
curl https://blog-api.diegopertusa.com/api/blog/articles

# 4. Verificar CORS desde el frontend (abrir https://diegopertusa.com y comprobar en consola)
```

---

## 8. Backup automático

Probar el script manualmente:

```bash
~/blog-api/scripts/backup-db.sh
```

Añadir al cron para ejecución diaria a las 3:00 AM:

```bash
crontab -e
```

Añadir la línea:

```
0 3 * * * /home/ubuntu/blog-api/scripts/backup-db.sh >> /home/ubuntu/backups/blog-db/backup.log 2>&1
```

---

## Troubleshooting

### Los contenedores no arrancan

```bash
docker compose -f docker-compose.prod.yml logs blog-api
docker compose -f docker-compose.prod.yml logs blog-db
```

### Caddy no sirve el dominio

```bash
sudo systemctl status caddy
sudo journalctl -u caddy --no-pager -n 50
```

### La BD no acepta conexiones

```bash
docker exec blog-db pg_isready -U postgres
```

### Rebuild tras cambios en el código

```bash
cd ~/blog-api
git pull
docker compose -f docker-compose.prod.yml up -d --build
```
