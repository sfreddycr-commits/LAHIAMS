# PERF-GATE — Performance, Load, Stress & Soak Testing

Este protocolo define cómo se valida capacidad antes de producción.

## Regla principal

Para aplicaciones web/API destinadas a producción:

`PERFORMANCE = NOT APPLICABLE`

solo se permite si el PM documenta explícitamente por qué la carga no es relevante.

En caso contrario, si todavía no se ha probado:

`PERFORMANCE = NOT VERIFIED`

Nunca tratar `NOT VERIFIED` como `PASS`.

---

## 1. Presupuesto de rendimiento

Antes de ejecutar pruebas, PM/PO debe definir o aprobar:

- usuarios concurrentes objetivo;
- requests por segundo objetivo;
- p95 máximo aceptable;
- p99 máximo aceptable;
- error rate máximo;
- duración de carga sostenida;
- endpoints críticos;
- límites de CPU/RAM aceptables;
- comportamiento esperado de DB.

Si el PO no conoce estos números, PERF puede proponer valores razonables según el tipo de producto, pero debe marcarlos como PROPUESTA hasta aprobación.

---

## 2. Tipos de prueba

### LOAD TEST
Comprueba la carga objetivo esperada.

### STRESS TEST
Incrementa carga de forma progresiva para encontrar el punto de degradación.

### SPIKE TEST
Simula un aumento brusco de tráfico.

### SOAK TEST
Mantiene carga sostenida para detectar:
- memory leaks;
- conexiones no liberadas;
- crecimiento de logs;
- degradación progresiva;
- agotamiento de pools.

### RECOVERY TEST
Verifica que el sistema se recupere después de saturación o degradación.

---

## 3. Métricas obligatorias

Medir cuando aplique:

- concurrencia;
- requests/segundo;
- throughput;
- p50;
- p95;
- p99;
- error rate;
- HTTP 4xx/5xx;
- CPU;
- RAM;
- swap;
- disco/I/O;
- conexiones DB;
- slow queries;
- locks;
- timeouts;
- restart/crash count;
- queue depth si existe;
- recovery time.

---

## 4. Entorno de prueba

No ejecutar stress/soak tests destructivos contra producción con usuarios reales.

Preferir:

- staging aislado;
- réplica de infraestructura;
- ventana controlada;
- límites de carga progresivos.

Si el VPS aloja proyectos adyacentes:

- medir baseline antes;
- no saturar servicios compartidos;
- abortar si recursos vecinos se degradan;
- comprobar salud después.

---

## 5. Ramp-up

La carga debe crecer gradualmente.

Ejemplo conceptual:

- nivel 1: baseline;
- nivel 2: carga normal;
- nivel 3: carga objetivo;
- nivel 4: pico;
- nivel 5: stress controlado.

Los números se definen por proyecto.

---

## 6. Criterios de PASS

PERF = PASS solo si:

- carga objetivo alcanzada;
- p95/p99 dentro de presupuesto;
- error rate dentro de presupuesto;
- CPU/RAM sin saturación sostenida;
- DB estable;
- sin memory leaks aparentes;
- sin caída de servicios vecinos;
- recuperación correcta;
- evidencia registrada.

---

## 7. Criterios de FAIL / CHANGES REQUIRED

Marcar 🟠 CHANGES REQUIRED si:

- p95/p99 excede límites;
- error rate excede límite;
- CPU/RAM se mantiene saturada;
- DB se convierte en cuello de botella no aceptable;
- aparecen timeouts;
- aparecen 5xx;
- hay fugas de memoria;
- el sistema no se recupera;
- servicios adyacentes se degradan.

---

## 8. Resultado del reporte PERF

El reporte debe incluir:

### CONTEXTO
- commit SHA;
- entorno;
- hardware;
- servicios;
- DB;
- configuración relevante.

### CARGA
- usuarios concurrentes;
- RPS;
- duración;
- patrón de ramp-up.

### RESULTADOS
- p50;
- p95;
- p99;
- error rate;
- CPU;
- RAM;
- DB connections;
- slow queries;
- observaciones.

### VEREDICTO
- PASS
- FAIL
- NOT VERIFIED

### CAPACIDAD OBSERVADA

Nunca declarar una capacidad universal.

Usar lenguaje como:

> En este entorno y con este commit, el sistema soportó X carga bajo estas condiciones.

No afirmar que soportará cualquier tráfico futuro.

---

## 9. Regla de evidencia externa

Si alguien cuestiona la capacidad del sistema, responder con resultados PERF, no con opiniones.

Nunca responder:

> "No se va a caer."

Responder:

> "Esta versión fue probada bajo estas condiciones y estos fueron los resultados."
