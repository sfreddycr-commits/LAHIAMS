# Stack Profile — LAMP-PHP83-MYSQL8-SP

ID: `LAMP-PHP83-MYSQL8-SP`

## Stack obligatorio

- Backend: PHP 8.3
- Base de datos: MySQL 8
- Acceso a datos: Stored Procedures
- Frontend: HTML + Tailwind CSS + JavaScript vanilla
- Server: Apache 2.4
- Auth: JWT HS256

## Seguridad obligatoria

- CSP estricta;
- headers de seguridad;
- rate limiting;
- validación estricta de inputs;
- SQL únicamente mediante Stored Procedures donde el perfil lo exija;
- secretos fuera del repositorio;
- configuración específica de entorno fuera del código;
- staging y producción separados;
- schemas portables sin `USE <db-produccion>`;
- logs sin secretos;
- JWT secret nunca hardcodeado en producción.

## Convenciones

- PHP con `strict_types=1` cuando sea compatible.
- PDO con exceptions.
- Stored Procedures legibles y versionados.
- Respuestas API JSON consistentes.
- HTTP status codes correctos.
- Nada de dependencias Node runtime para backend.
- Tailwind compilado o servido según estrategia aprobada.
