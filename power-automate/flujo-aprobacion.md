# Flujo de aprobación

## Flujo 1: iniciar aprobación

**Disparador:** Power Apps (V2), con el parámetro numérico `SolicitudId`.

1. Obtener la solicitud de SharePoint por ID.
2. Validar que el estado sea `Pendiente`.
3. Determinar el aprobador según categoría y área.
4. Actualizar el campo `Aprobador`.
5. Crear y esperar una aprobación de tipo “Primero en responder”.
6. Evaluar el resultado:
   - Si se aprueba, establecer `Estado = Aprobada`.
   - Si se rechaza, establecer `Estado = Rechazada` y guardar el comentario.
7. Registrar el evento en `HistorialSolicitudes`.
8. Enviar la respuesta al solicitante por Outlook.
9. Publicar un aviso en Teams sin incluir datos sensibles.

## Expresiones relevantes

### Código de seguimiento

```text
concat('SOL-', formatDateTime(utcNow(), 'yyyyMMdd'), '-', padLeft(string(triggerBody()?['numero']), 5, '0'))
```

### Días transcurridos

```text
div(sub(ticks(utcNow()), ticks(items('Aplicar_a_cada')?['FechaSolicitud'])), 864000000000)
```

## Flujo 2: recordar solicitudes pendientes

**Disparador:** Recurrencia, de lunes a viernes a las 08:00.

1. Consultar solicitudes con estado `Pendiente`.
2. Calcular los días transcurridos.
3. Enviar recordatorio cuando hayan transcurrido dos días.
4. Escalar al responsable del área cuando hayan transcurrido cuatro días.
5. Registrar el recordatorio o escalamiento en el historial.

## Manejo de errores

Las acciones principales se agrupan en un ámbito `Proceso`. Otro ámbito `ControlError` se ejecuta si el primero falla o supera el tiempo permitido. Allí se registra el ID, el paso fallido y el mensaje técnico, y se notifica al administrador del proceso.

