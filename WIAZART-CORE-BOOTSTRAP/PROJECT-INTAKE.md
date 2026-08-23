# Project Intake Protocol — Wiazart Core

Este protocolo se ejecuta inmediatamente después de leer `START-HERE.md`.

OpenCode debe determinar primero en qué situación está el proyecto.

No debe implementar funcionalidad antes de completar este intake.

---

# MODO A — PROYECTO NUEVO

Usar cuando:

- la carpeta está vacía;
- solo existe documentación inicial;
- no existe arquitectura consolidada;
- no existe aplicación funcional;
- el PO confirma que se va a construir desde cero.

## Flujo

1. Confirmar que es un proyecto nuevo.
2. Preguntar al PO:

   - ¿Qué quieres construir?
   - ¿Para quién es?
   - ¿Cuál es el problema que resuelve?
   - ¿Cuáles son las funciones principales?
   - ¿Hay una fecha o prioridad importante?

3. Leer `stacks/CATALOG.md`.
4. Preguntar qué stack tecnológico se desea utilizar.
5. Si el PO no sabe cuál elegir:
   - explicar brevemente las opciones;
   - recomendar una según el proyecto;
   - no decidir de forma silenciosa.
6. Registrar el perfil seleccionado.
7. Activar PM → ARCH → DBA/UX cuando aplique.
8. Crear la primera SPEC.
9. Solo después puede iniciar DEVELOPER.

## Mensaje final del intake

OpenCode debe responder:

`✅ WIAZART CORE — MODO PROYECTO NUEVO`

y mostrar:

- objetivo entendido;
- stack seleccionado;
- arquitectura pendiente/aprobada;
- riesgos iniciales;
- próximo paso.

---

# MODO B — PROYECTO EXISTENTE / IMPORTADO

Usar cuando el proyecto:

- ya contiene código;
- fue clonado de GitHub;
- fue descargado de Internet;
- vino de un tutorial o video;
- fue comprado;
- fue heredado de otro desarrollador;
- fue generado previamente por otra IA;
- proviene de un ZIP;
- ya está parcialmente o totalmente funcional.

## Regla principal

NO MODIFICAR CÓDIGO durante el intake.

Primero entender el proyecto.

## Fase 1 — Inventario

Detectar:

- nombre del proyecto;
- objetivo aparente;
- frontend;
- backend;
- runtime;
- frameworks;
- dependencias;
- base de datos;
- autenticación;
- servidor;
- configuración;
- scripts;
- tests;
- CI/CD;
- Git;
- documentación;
- rutas de deploy;
- archivos sensibles;
- `.env`;
- secretos potenciales;
- licencias;
- código generado;
- servicios externos;
- APIs;
- estado general.

## Fase 2 — Auditoría inicial

Clasificar:

### FUNCIONALIDAD
- qué funciona;
- qué parece incompleto;
- qué está roto;
- qué no puede verificarse.

### ARQUITECTURA
- estructura;
- acoplamiento;
- duplicación;
- deuda;
- dependencias innecesarias;
- decisiones extrañas.

### SEGURIDAD
- secretos;
- auth/authz;
- IDOR;
- SQLi;
- XSS;
- CSRF;
- SSRF;
- uploads;
- rate limiting;
- headers;
- dependencias vulnerables.

### BASE DE DATOS
- modelo;
- migraciones;
- índices;
- credenciales;
- datos destructivos;
- separación de entornos.

### OPERACIÓN
- cómo se ejecuta;
- cómo se despliega;
- logs;
- observabilidad;
- riesgos al VPS.

### LICENCIA / ORIGEN
Si el proyecto viene de terceros, identificar licencias y restricciones visibles.
No asumir que código descargado puede usarse comercialmente sin verificar.

## Fase 3 — Estado de confianza

Cada área debe clasificarse como:

- ✅ VERIFICADO
- ⚠️ PARCIALMENTE VERIFICADO
- ❌ PROBLEMA
- ❓ NO VERIFICADO

No afirmar que algo funciona sin haberlo comprobado.

## Fase 4 — Pregunta obligatoria al PO

Después de entender el proyecto, OpenCode debe detenerse y preguntar:

# ¿Qué quieres hacer con este proyecto?

Ofrecer estas opciones:

**A — CONTINUARLO**
Mantener arquitectura actual y desarrollar nuevas funciones.

**B — SANEARLO**
Corregir seguridad, estructura, bugs, deuda y preparación para producción antes de agregar funciones.

**C — MIGRARLO**
Cambiar stack, arquitectura, DB o infraestructura.

**D — AUDITARLO SOLAMENTE**
Entregar diagnóstico sin modificar código.

**E — RECONSTRUIRLO**
Usar el proyecto solo como referencia funcional y rehacerlo con una arquitectura limpia.

**F — PERSONALIZADO**
El PO explica el objetivo.

No ejecutar ninguna opción hasta que el PO elija.

## Fase 5 — Recomendación

OpenCode puede recomendar una opción, pero debe separar:

- HECHOS;
- RIESGOS;
- RECOMENDACIÓN.

La decisión final pertenece al PO.

## Mensaje final del intake

OpenCode debe responder:

`✅ WIAZART CORE — MODO PROYECTO EXISTENTE`

y mostrar:

- stack detectado;
- estado general;
- funcionalidades encontradas;
- riesgos principales;
- secretos detectados (sin mostrarlos);
- estado Git;
- nivel de confianza;
- recomendación;
- pregunta: `¿Qué quieres hacer con este proyecto?`

---

# MODO C — NO SE PUEDE DETERMINAR

Si OpenCode no puede determinar si es nuevo o existente:

Debe preguntar:

`¿Este proyecto lo vamos a construir desde cero o ya contiene una aplicación que quieres continuar/modificar?`

No asumir.

---

# Regla de seguridad para proyectos descargados

Un proyecto descargado o heredado se considera NO CONFIABLE hasta ser auditado.

Antes de ejecutar scripts desconocidos:

1. leerlos;
2. revisar package scripts / composer scripts / shell scripts;
3. buscar operaciones destructivas;
4. buscar conexiones externas;
5. buscar secretos;
6. verificar dependencias;
7. evitar ejecutar con privilegios elevados.

Nunca ejecutar automáticamente:

- scripts de instalación desconocidos como root;
- comandos destructivos;
- migraciones contra producción;
- binarios desconocidos;
- código que requiera secretos reales.

---

# Resultado del Intake

El intake termina únicamente cuando:

1. se conoce el modo;
2. se conoce el estado del proyecto;
3. el PO eligió qué quiere hacer;
4. se conoce o eligió el stack;
5. PM puede emitir una SPEC clara.

Después comienza el ciclo normal de Wiazart Core.
