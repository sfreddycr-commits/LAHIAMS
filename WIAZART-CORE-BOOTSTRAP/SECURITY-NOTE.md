# Seguridad

Esta plantilla no contiene secretos, credenciales, tokens, claves privadas ni archivos `.env`.

## Política

- secretos reales fuera del repo;
- si un secreto entra en Git, se considera comprometido y se rota;
- staging y producción deben estar aislados;
- schemas reutilizables no deben forzar una DB de producción;
- Production Readiness Gate obligatorio antes de producción.
