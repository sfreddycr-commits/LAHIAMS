# Production Readiness Gate — Wiazart Core

Este documento define la puerta obligatoria previa a producción.

## Estados por gate

- PASS
- FAIL
- NOT APPLICABLE
- NOT VERIFIED

NOT VERIFIED nunca equivale a PASS.

## Gates

### Secrets
Verificar que secretos reales no estén en Git, frontend ni logs. Si un secreto fue versionado, rotarlo.

### Environment Isolation
Separar staging y producción. Antes de migrar, mostrar entorno, host, DB y commit.

### Database Safety
Schemas/migraciones no deben forzar una DB de producción. Revisar índices, integridad, rollback y recuperación.

### Performance
Medir concurrencia, throughput, p50/p95/p99, errores, CPU, RAM, I/O, DB y carga sostenida según objetivos del proyecto.

### Security
Revisar auth, autorización, IDOR, SQLi, XSS, CSRF, SSRF, sesiones, tokens, rate limiting, uploads, CORS, CSP, headers, dependencias y datos sensibles.

### Failure & Recovery
Probar fallos de DB/servicios, timeouts, tokens expirados, reinicio y rollback cuando aplique.

### Observability
Health check, logs, recursos, DB, latencia y disponibilidad.

### Deployment
Registrar repo, branch/tag, commit, entorno, DB destino, migraciones, smoke tests y rollback.

### Post-Deploy
SRE valida salud real antes de PRODUCTION VERIFIED.


## Regla especial de PERF

Para aplicaciones web/API de producción, PERF no debe marcarse N/A automáticamente.

- `NOT APPLICABLE`: únicamente con justificación PM.
- `NOT VERIFIED`: cuando aún no existe prueba formal.
- `PASS`: solo con evidencia de carga.

Una release puede avanzar de forma excepcional con PERF `NOT VERIFIED` únicamente mediante aceptación explícita de riesgo por PM/PO, documentada.
