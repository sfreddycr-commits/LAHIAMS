# Catálogo de Stacks — Wiazart Core

Cuando un proyecto nace desde cero, OpenCode NO debe asumir el stack.

Debe preguntar al PO cuál perfil desea utilizar.

Perfiles oficiales iniciales:

1. `LAMP-PHP83-MYSQL8-SP`
2. `REACT-NODE`
3. `CUSTOM`

Si el proyecto ya contiene código, primero detectar el stack existente y preguntar antes de reemplazarlo.

---

## LAMP-PHP83-MYSQL8-SP

Backend: PHP 8.3  
BD: MySQL 8  
Acceso a datos: Stored Procedures como estándar del proyecto  
Frontend: HTML + Tailwind CSS + JavaScript vanilla  
Server: Apache 2.4  
Auth: JWT HS256  
Seguridad: CSP estricta, headers de seguridad, rate limiting, secretos fuera del repo.

Ideal para:
- VPS tradicional;
- hosting Apache;
- aplicaciones CRUD/API ligeras;
- proyectos donde se desea mínima dependencia runtime.

---

## REACT-NODE

Frontend: React (preferir Vite salvo justificación distinta)  
Backend: Node.js LTS  
API: Express/Fastify según decisión ARCH  
BD: MySQL 8 o PostgreSQL según requerimiento  
Acceso a datos: SQL parametrizado / query builder / ORM según ARCH + DBA  
Auth: JWT o sesiones seguras según producto  
CSS/UI: Tailwind CSS cuando aplique  
Seguridad: CSP, headers, CORS explícito, rate limiting, validación de inputs, secretos fuera del repo.

Reglas:
- dependencias deben estar justificadas;
- evitar paquetes innecesarios;
- lockfile obligatorio;
- auditoría de dependencias;
- separar frontend/backend cuando la arquitectura lo requiera;
- no introducir framework adicional sin decisión ARCH.

---

## CUSTOM

El PO puede definir un stack personalizado.

OpenCode debe recopilar como mínimo:

- frontend;
- backend;
- runtime/lenguaje;
- base de datos;
- acceso a datos;
- servidor/hosting;
- autenticación;
- estrategia CSS/UI;
- testing;
- seguridad;
- deploy;
- observabilidad.

ARCH debe validar el resultado antes de iniciar implementación.
