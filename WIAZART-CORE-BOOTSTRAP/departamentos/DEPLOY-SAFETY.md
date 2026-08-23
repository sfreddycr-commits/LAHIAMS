# DEPLOY-SAFETY — Seguridad de Entornos y Despliegue

## Regla principal

Nunca asumir el destino de una operación destructiva.

Antes de schemas, migraciones o cambios sensibles mostrar:

- ENVIRONMENT
- HOST
- DATABASE
- REPOSITORY
- BRANCH/TAG
- COMMIT SHA

## Base de datos

Schemas reutilizables no deben contener `USE <db-produccion>` ni crear/seleccionar una DB productiva de forma implícita.

La DB destino debe seleccionarse externamente por el comando de despliegue o por un mecanismo explícito y auditable.

## Producción adyacente

Si el VPS aloja otros proyectos:

- comprobar salud antes;
- evitar reinicios globales;
- no ejecutar pruebas destructivas;
- comprobar salud después.

Si hay duda:

🔴 BLOCKED
