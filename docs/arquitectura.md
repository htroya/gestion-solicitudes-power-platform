# Arquitectura de la solución

## Componentes

| Componente | Responsabilidad |
|---|---|
| Power Apps Canvas | Registro, consulta y visualización del historial |
| SharePoint `Solicitudes` | Datos principales y estado vigente |
| SharePoint `HistorialSolicitudes` | Auditoría de eventos y comentarios |
| Power Automate | Aprobación, notificación, recordatorio y escalamiento |
| Microsoft Entra ID | Identidad del usuario y pertenencia a grupos |
| Outlook / Teams | Comunicación con solicitantes y aprobadores |

## Decisiones de diseño

### Separar solicitud e historial

La lista `Solicitudes` conserva el estado actual. `HistorialSolicitudes` registra cada evento. Esta separación facilita consultar la bandeja diaria sin perder la trazabilidad.

### Mantener la decisión en el servidor

Power Apps inicia el proceso, pero Power Automate valida y actualiza la decisión. Así se evita depender únicamente de controles visibles en la aplicación.

### Usar grupos para los permisos

Los permisos se asignan a grupos y no directamente a personas. Se consideran tres perfiles: solicitante, aprobador y administrador.

## Controles recomendados

- Validar campos obligatorios tanto en Power Apps como en el flujo.
- Limitar los permisos de edición de las listas.
- Registrar fecha, usuario y comentario en cada cambio de estado.
- Evitar datos sensibles en mensajes de Teams o correos.
- Configurar una cuenta propietaria de servicio para los flujos productivos.

