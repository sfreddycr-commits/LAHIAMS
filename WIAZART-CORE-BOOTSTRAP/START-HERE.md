# WIAZART CORE — START HERE

> ÚNICO PUNTO DE ENTRADA.
> Cuando el PO diga `CARGA WIAZART CORE`, OpenCode debe leer este archivo completo y ejecutar el protocolo en el orden indicado.
> No desarrollar, desplegar ni modificar funcionalidad durante el bootstrap.

## 1. Objetivo

Wiazart Core es un sistema portátil de gobernanza para ingeniería de software asistida por IA.

Principios:
- GitHub = fuente de verdad del código.
- El VPS = entorno de ejecución/validación, nunca repositorio alternativo.
- Evidencia > afirmaciones.
- Ningún agente se autoaprueba.
- Secretos fuera del repositorio.
- Staging y producción separados.
- Producción adyacente intocable.
- El PO conserva la decisión final de producto.
- La IA puede equivocarse; el proceso debe detectarlo.

## 2. Reconocimiento inicial — SOLO LECTURA

Antes de modificar cualquier archivo, inspeccionar:
- nombre y ubicación;
- si contiene código o está vacío;
- frontend/backend/runtime/frameworks;
- base de datos;
- autenticación;
- servidor/hosting;
- dependencias;
- tests;
- CI/CD;
- Git/remotes/branch;
- documentación;
- AGENTS existente;
- configuración;
- posibles secretos (sin mostrarlos);
- método de deploy;
- servicios/proyectos vecinos;
- origen/licencia visible si es código de terceros.

Nunca asumir el stack ni ejecutar scripts desconocidos durante esta fase.

## 3. PROJECT INTAKE — OBLIGATORIO ANTES DEL STACK

Leer ahora:
`PROJECT-INTAKE.md`

Determinar:

### MODO A — PROYECTO NUEVO
1. preguntar qué quiere construir el PO;
2. para quién;
3. problema;
4. funciones principales;
5. prioridades/fecha;
6. luego seleccionar stack.

### MODO B — PROYECTO EXISTENTE / IMPORTADO
1. NO modificar;
2. inventariar;
3. auditar funcionalidad, arquitectura, seguridad, DB y operación;
4. clasificar VERIFICADO / PARCIAL / PROBLEMA / NO VERIFICADO;
5. preguntar al PO:
   - CONTINUAR
   - SANEAR
   - MIGRAR
   - AUDITAR SOLAMENTE
   - RECONSTRUIR
   - PERSONALIZADO
6. conservar stack existente por defecto hasta autorización PO + PM + ARCH.

### MODO C — INDETERMINADO
Preguntar si se construye desde cero o si ya contiene una aplicación.
No asumir.

## 4. Selección / confirmación del Stack

Solo después del Project Intake leer:
`stacks/CATALOG.md`

Proyecto nuevo:
- A — LAMP-PHP83-MYSQL8-SP
- B — REACT-NODE
- C — CUSTOM

Si el PO no sabe cuál elegir, explicar y recomendar; nunca decidir silenciosamente.

Proyecto existente:
mostrar stack detectado y preguntar si se conserva.
No migrar automáticamente.

## 5. STACK-PROFILE

Crear en plano privado `STACK-PROFILE.md` con:
- Profile ID
- frontend
- backend
- runtime
- framework
- DB
- acceso a datos
- server/hosting
- auth
- seguridad
- testing
- dependencias/restricciones
- deploy
- observabilidad

Cambiar stack requiere PO → PM → ARCH → decisión → plan de migración.

## 6. Mapa de Roles

Leer `ROLE-MAP.md`.

### PO
Usuario/Product Owner.

### PM
Rol de Project Management.
Puede ejecutarse dentro de OpenCode.
Registrar `PM_MODEL`.

### DEVELOPER
Por defecto ChatGPT / GPT-5.6 Sol vía GitHub.

### OpenCode
Agente local con acceso al workspace/VPS.
Puede hospedar PM y ejecutar QA/DEVOPS/SRE/PERF/CYBERS.

Si OpenCode participó en una implementación, esa misma acción no cuenta como revisión independiente sin evidencia/revisión adicional.

## 7. Canal de comunicación — USUARIO PUENTE

Por defecto:
PM/OpenCode → USUARIO → ChatGPT/DEVELOPER → GitHub(código) → USUARIO → OpenCode

GitHub contiene:
- código;
- tests;
- migraciones;
- configuración segura;
- documentación técnica del producto;
- PRs técnicos.

No versionar por defecto:
- bootstrap;
- prompts;
- handoffs;
- conversaciones;
- reportes internos;
- departamentos/metodología privada.

Comentarios directos entre agentes en PR solo si el PO lo autoriza.

No borrar ni reescribir historial para ocultar algo ya versionado.
Respetar políticas de la organización.

## 8. Instalación privada e idempotente

Crear/adaptar:
- AGENTS operativo privado;
- departamentos;
- STACK-PROFILE.md;
- sprints;
- decisiones;
- métricas;
- WIAZART-HANDOFF-CHATGPT.md.

No sobreescribir reglas específicas a ciegas.
Reejecutar `CARGA WIAZART CORE` no debe duplicar ni destruir información.

## 9. Flujo de Ingeniería

PO → PM → SPEC → ARCH/DBA/UX → DEVELOPER → branch → implementación → tests → commit → PR → OpenCode(QA/DEVOPS/SRE/PERF/CYBERS) → evidencia → PM → merge → deploy → SRE → PRODUCTION VERIFIED

Si falla:
OpenCode → usuario → Developer → corrección → usuario → OpenCode → re-verificación.

## 10. Estados

- 🟡 EN DESARROLLO
- 🔵 READY FOR QA
- 🟠 VERIFICATION REQUIRED
- 🟠 CHANGES REQUIRED
- 🟣 READY FOR PRODUCTION
- 🟢 PRODUCTION VERIFIED
- 🔴 BLOCKED

## 11. Evidencia

HECHO / INFERIDO / NO VERIFICADO

Gates:
PASS / FAIL / NOT APPLICABLE / NOT VERIFIED

NOT VERIFIED nunca equivale a PASS.

## 12. Secrets Gate

Prohibido versionar/exponer:
- passwords;
- API keys;
- tokens reales;
- JWT secrets;
- credenciales DB;
- claves privadas;
- secretos en logs;
- secretos en frontend.

Los secretos viven en variables de entorno, configuración privada o secret manager.

Si un secreto llega a Git:
🔴 BLOCKED + rotación + investigación.

Nunca imprimir el secreto durante auditoría.

## 13. Environment Isolation Gate

Verificar:
- staging DB != producción DB;
- staging config != producción;
- credenciales separadas cuando sea posible;
- schema sin `USE <db-produccion>`;
- scripts sin host/path productivo forzado;
- pruebas destructivas nunca en producción.

Antes de operación DB sensible mostrar:
ENVIRONMENT / HOST / DATABASE / REPOSITORY / BRANCH-TAG / COMMIT SHA

Destino ambiguo = 🔴 BLOCKED.

## 14. Database Safety Gate

Verificar cuando aplique:
- migraciones;
- índices;
- integridad;
- transacciones;
- queries críticas;
- conexiones/pool;
- rollback;
- backup/restauración en cambios destructivos.

Stored Procedures solo son obligatorios si el Stack Profile lo establece.

## 15. Security Gate

CYBERS revisa según superficie:
auth, authz, IDOR, SQLi, XSS, CSRF, SSRF, JWT/sesiones, rate limiting, brute force, uploads, traversal, CORS, CSP, headers, dependencias, datos sensibles, exposición y logs.

CRITICAL = 🔴 BLOCKED
HIGH sin mitigación = 🔴 BLOCKED

## 16. Performance Gate

Leer `departamentos/PERF-GATE.md`.

Para web/API:
- N/A requiere justificación PM.
- sin prueba formal = NOT VERIFIED.
- NOT VERIFIED ≠ PASS.

Medir según aplique:
concurrencia, RPS, p50/p95/p99, error rate, CPU, RAM, I/O, DB, slow queries, timeouts y recuperación.

Nunca afirmar que “aguanta” sin evidencia.

## 17. Failure & Recovery Gate

Probar según aplique:
DB no disponible, servicio externo caído, request inválido, timeout, token expirado, reinicio, rollback y degradación segura.

Nunca revelar stack traces/secretos, corromper datos o afectar vecinos.

## 18. Observability Gate

Confirmar:
health, logs, errores HTTP, CPU, RAM, disco, DB, latencia, disponibilidad.

Deploy exitoso ≠ sistema saludable.

## 19. Deployment Gate

Todo deploy identifica:
repo, branch/tag, commit SHA, entorno, DB destino, migraciones, procedimiento, smoke tests y rollback.

VPS nunca es fuente de verdad.

## 20. Producción Adyacente

Si el servidor hospeda otros proyectos:
- comprobar salud antes;
- no reiniciar servicios compartidos sin análisis/autorización;
- no hacer pruebas destructivas compartidas;
- comprobar salud después.

## 21. Post-Deploy Gate

SRE verifica:
health, smoke tests, logs, errores, CPU/RAM, DB, endpoints críticos y vecinos.

Solo después:
🟢 PRODUCTION VERIFIED

## 22. Definition of Done

- [ ] requerimiento entendido
- [ ] criterios verificables
- [ ] arquitectura respetada
- [ ] stack profile respetado
- [ ] build/lint
- [ ] tests
- [ ] QA
- [ ] DB
- [ ] CYBERS
- [ ] PERF
- [ ] environment isolation
- [ ] secrets gate
- [ ] deploy reproducible
- [ ] smoke
- [ ] logs
- [ ] observabilidad
- [ ] rollback
- [ ] documentación/evidencia
- [ ] PM aprobado

Fallo obligatorio = NOT READY.

## 23. Handoff obligatorio para ChatGPT

Generar fuera de Git:
`WIAZART-HANDOFF-CHATGPT.md`

Usar:
`templates/HANDOFF-CHATGPT.template.md`

Rellenar con datos reales:
proyecto/repo, branch/commit, intake, origen, decisión PO, PM model, stack, arquitectura, estado, SPEC/PR, bloqueadores, riesgos y próxima acción exacta.

No incluir secretos.

## 24. No hacer deploy durante Bootstrap

Bootstrap solo:
inspecciona, clasifica, pregunta, selecciona/confirma stack, prepara control privado y genera handoff.

No desarrolla, migra, refactoriza ni despliega.

## 25. Mensaje final obligatorio

# ✅ PERFIL WIAZART-CORE CARGADO

Mostrar:
modo, proyecto, origen, stack, PM model, repo/branch, estado Git, riesgos, partes no verificadas, decisión PO y próximo paso.

Luego:

# HANDOFF PARA CHATGPT

Entregar el handoff completo.

## 26. Mejora continua

Hallazgo reusable:
1. corregir proyecto;
2. decidir si es general;
3. actualizar Wiazart Core;
4. subir VERSION;
5. distribuir ZIP completo.

No agregar burocracia sin propósito.

## 27. Regla final

Developer construye.
OpenCode verifica el entorno.
Las pruebas producen evidencia.
PM emite veredicto.
PO decide producto.
GitHub conserva el código.
