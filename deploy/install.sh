#!/usr/bin/env bash
# LAHIAM'S — Apache 2.4 + PHP 8.3 deploy helper (run as root on the VPS).
# Copia el proyecto, instala el vhost, habilita módulos y fija permisos.
# NO toca otros proyectos en el server. Requiere PHP 8.3 + mod_php + mysqlnd.
set -euo pipefail

SRC="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
DOCROOT="${2:-/var/www/html}"
APACHE_CONF="/etc/apache2/sites-available/lahiams.conf"
CACHE_DIR="$DOCROOT/api/cache"

echo "==> Origen: $SRC"
echo "==> DocumentRoot: $DOCROOT"

# 1) Sincronizar archivos (preserva .env si ya existe)
rsync -a --exclude='.git' --exclude='node_modules' --exclude='deploy/apache.conf' \
  "$SRC"/ "$DOCROOT"/
[ -f "$DOCROOT/.env" ] || cp "$DOCROOT/.env.example" "$DOCROOT/.env"
echo "==> Editá $DOCROOT/.env con DB_*, JWT_SECRET, APP_USER y APP_PASS reales."

# 2) Instalar vhost (usa el archivo deploy/apache.conf como base)
cp "$SRC/deploy/apache.conf" "$APACHE_CONF"

# 3) Módulos y sitio
a2enmod rewrite headers php8.3 >/dev/null 2>&1 || true
a2ensite lahiams.conf >/dev/null 2>&1 || true

# 4) Permisos de caché (rate limiting)
mkdir -p "$CACHE_DIR/rl"
chown -R www-data:www-data "$CACHE_DIR"
chmod -R 750 "$CACHE_DIR"

# 5) Recargar
systemctl reload apache2 || systemctl restart apache2

echo "==> Deploy listo. Ejecutá el migrate una vez: POST $DOCROOT no aplica;"
echo "    usá: curl -X POST https://TU_DOMINIO/api/setup  (requiere JWT en prod si está protegido)."
