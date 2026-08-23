# Stack Profile — REACT-NODE

ID: `REACT-NODE`

## Stack base

- Frontend: React
- Build frontend: Vite por defecto
- Backend: Node.js LTS
- API: Express o Fastify, decisión ARCH
- Base de datos: MySQL 8 o PostgreSQL, decisión DBA/ARCH
- UI: Tailwind CSS cuando aplique
- Auth: JWT o sesiones seguras según arquitectura

## Dependencias

Toda dependencia debe:

1. resolver una necesidad real;
2. estar mantenida;
3. no duplicar funcionalidad existente;
4. quedar fijada mediante lockfile;
5. pasar auditoría de vulnerabilidades.

Evitar instalar librerías por comodidad si unas pocas líneas mantenibles resuelven el problema.

## Seguridad

- secretos únicamente mediante environment/secret manager;
- validación de inputs;
- CORS explícito;
- rate limiting;
- headers de seguridad;
- CSP cuando aplique;
- authz server-side;
- protección IDOR;
- queries parametrizadas;
- manejo centralizado de errores;
- no exponer stack traces en producción.

## Operación

- health endpoint;
- graceful shutdown;
- logs estructurados;
- process manager/container según infraestructura;
- límites de recursos;
- observabilidad;
- load testing antes de producción cuando corresponda.
