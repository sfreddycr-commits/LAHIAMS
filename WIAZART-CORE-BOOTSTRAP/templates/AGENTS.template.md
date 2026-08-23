# Wiazart Core — Constitución del Proyecto

> Plano de control privado por defecto. Adaptar al proyecto real.

## 1. Principios
- GitHub es fuente de verdad del código.
- Evidencia > palabras.
- Ningún actor se autoaprueba.
- Secretos fuera del repo.
- Staging y producción separados.
- Producción adyacente intocable.
- El stack activo se respeta.
- NOT VERIFIED nunca equivale a PASS.

## 2. Roles
PO = producto/prioridad.
PM = SPEC/veredicto; registrar PM_MODEL.
DEVELOPER = ChatGPT/GPT-5.6 Sol vía GitHub por defecto.
OpenCode = agente local; puede hospedar PM y ejecutar QA/DEVOPS/SRE/PERF/CYBERS.

## 3. Comunicación
Por defecto el usuario es puente:
OpenCode/PM → usuario → Developer → GitHub → usuario → OpenCode.

## 4. Project Intake
NUEVO → necesidad → stack → ARCH → SPEC.
EXISTENTE/IMPORTADO → inventario → auditoría → PO elige continuar/sanear/migrar/auditar/reconstruir/personalizado.
No modificar durante intake.

## 5. Stack Activo
Profile ID:
Frontend:
Backend:
Runtime:
Framework:
DB:
Acceso a datos:
Server:
Auth:
Seguridad:
Testing:
Dependencias:
Deploy:
Observabilidad:

No cambiar stack implícitamente.

## 6. Flujo
PO → PM → SPEC → ARCH/DBA/UX → DEVELOPER → branch/tests/PR → OpenCode → evidencia → PM → merge → deploy → SRE.

## 7. Estados
🟡 EN DESARROLLO
🔵 READY FOR QA
🟠 VERIFICATION REQUIRED
🟠 CHANGES REQUIRED
🟣 READY FOR PRODUCTION
🟢 PRODUCTION VERIFIED
🔴 BLOCKED

## 8. Production Readiness Gate
Secrets / Environment / DB / Security / PERF / Failure-Recovery / Observability / Deployment.
PASS / FAIL / NOT APPLICABLE / NOT VERIFIED.
N/A de PERF requiere justificación PM.
Sin prueba formal = NOT VERIFIED.
Stored Procedures solo obligatorios si el Stack Profile lo exige.

## 9. Post-Deploy
SRE verifica salud antes de PRODUCTION VERIFIED.

## 10. Definition of Done
- [ ] requisito
- [ ] criterios
- [ ] arquitectura
- [ ] stack
- [ ] build/lint
- [ ] tests
- [ ] QA
- [ ] DB
- [ ] CYBERS
- [ ] PERF
- [ ] secretos
- [ ] aislamiento
- [ ] deploy
- [ ] smoke
- [ ] logs
- [ ] observabilidad
- [ ] rollback
- [ ] evidencia
- [ ] PM aprobado

## 11. Anti-vibecoding ciego
No: PROMPT → SE VE BIEN → PRODUCCIÓN.
Sí: REQUERIMIENTO → DISEÑO → IMPLEMENTACIÓN → REVISIÓN → TEST → SEGURIDAD → PERFORMANCE → DEPLOY → OBSERVABILIDAD → EVIDENCIA.
