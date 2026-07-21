# Fórmulas Power Fx

Los nombres de controles y variables están en español para facilitar el mantenimiento por el equipo funcional.

## Inicialización de la aplicación

```powerfx
Set(varUsuarioActual; User());;
Set(varEstadoInicial; "Pendiente");;
ClearCollect(
    colCategorias;
    Table(
        {Valor: "Acceso"};
        {Valor: "Compra"};
        {Valor: "Soporte"};
        {Valor: "Otro"}
    )
)
```

## Registrar una solicitud

```powerfx
If(
    IsBlank(txtAsunto.Text) || IsBlank(txtDescripcion.Text);
    Notify("Complete el asunto y la descripción."; NotificationType.Warning);
    Set(varGuardando; true);;
    Set(
        varSolicitudCreada;
        Patch(
            Solicitudes;
            Defaults(Solicitudes);
            {
                Title: Trim(txtAsunto.Text);
                Descripcion: Trim(txtDescripcion.Text);
                Categoria: {Value: cmbCategoria.Selected.Valor};
                Prioridad: {Value: cmbPrioridad.Selected.Value};
                Estado: {Value: varEstadoInicial};
                Solicitante: {
                    Claims: "i:0#.f|membership|" & Lower(varUsuarioActual.Email);
                    DisplayName: varUsuarioActual.FullName;
                    Email: Lower(varUsuarioActual.Email)
                };
                FechaSolicitud: Now()
            }
        )
    );;
    FlujoIniciarAprobacion.Run(varSolicitudCreada.ID);;
    Set(varGuardando; false);;
    Notify("Solicitud registrada correctamente."; NotificationType.Success);;
    Navigate(scrMisSolicitudes; ScreenTransition.Fade)
)
```

## Mostrar las solicitudes del usuario

```powerfx
SortByColumns(
    Filter(
        Solicitudes;
        Solicitante.Email = Lower(varUsuarioActual.Email)
    );
    "FechaSolicitud";
    SortOrder.Descending
)
```

## Color del estado

```powerfx
Switch(
    ThisItem.Estado.Value;
    "Aprobada"; ColorValue("#107C10");
    "Rechazada"; ColorValue("#A4262C");
    "Pendiente"; ColorValue("#CA5010");
    ColorValue("#605E5C")
)
```

## Evitar envíos duplicados

```powerfx
DisplayMode = If(varGuardando; DisplayMode.Disabled; DisplayMode.Edit)
```

