# Modelo de datos en SharePoint

## Lista `Solicitudes`

| Columna | Tipo | Uso |
|---|---|---|
| Title | Texto | Asunto de la solicitud |
| Descripcion | Varias líneas | Detalle del requerimiento |
| Categoria | Elección | Acceso, compra, soporte u otro |
| Prioridad | Elección | Baja, media o alta |
| Estado | Elección | Borrador, pendiente, aprobada o rechazada |
| Solicitante | Persona | Usuario que registra el caso |
| Aprobador | Persona | Responsable de decidir |
| FechaSolicitud | Fecha y hora | Inicio del proceso |
| FechaDecision | Fecha y hora | Fin de la aprobación |
| ComentarioDecision | Varias líneas | Justificación de la decisión |
| CodigoSeguimiento | Texto | Identificador visible para el usuario |

## Lista `HistorialSolicitudes`

| Columna | Tipo | Uso |
|---|---|---|
| Title | Texto | Código de seguimiento |
| SolicitudId | Número | Identificador de la solicitud |
| EstadoAnterior | Texto | Estado antes del evento |
| EstadoNuevo | Texto | Estado posterior |
| Responsable | Persona | Usuario o flujo que ejecutó el cambio |
| FechaEvento | Fecha y hora | Momento del cambio |
| Comentario | Varias líneas | Información adicional |

## Índices recomendados

Crear índices para `Estado`, `Solicitante`, `Aprobador` y `FechaSolicitud`. Esto evita problemas de rendimiento cuando aumenta el número de elementos.

