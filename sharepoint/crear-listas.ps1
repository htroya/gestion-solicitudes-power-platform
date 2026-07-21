# Requiere el módulo PnP.PowerShell y permisos para administrar el sitio.
# Ejemplo: .\crear-listas.ps1 -UrlSitio "https://contoso.sharepoint.com/sites/solicitudes"

param(
    [Parameter(Mandatory = $true)]
    [string]$UrlSitio
)

$ErrorActionPreference = "Stop"

Connect-PnPOnline -Url $UrlSitio -Interactive

function Crear-ListaSiNoExiste {
    param(
        [string]$NombreLista,
        [string]$Descripcion
    )

    $lista = Get-PnPList -Identity $NombreLista -ErrorAction SilentlyContinue
    if ($null -eq $lista) {
        New-PnPList -Title $NombreLista -Template GenericList -OnQuickLaunch
        Set-PnPList -Identity $NombreLista -Description $Descripcion
        Write-Host "Lista creada: $NombreLista"
    }
    else {
        Write-Host "La lista ya existe: $NombreLista"
    }
}

function Crear-CampoSiNoExiste {
    param(
        [string]$NombreLista,
        [string]$NombreInterno,
        [string]$NombreVisible,
        [string]$Tipo
    )

    $campo = Get-PnPField -List $NombreLista -Identity $NombreInterno -ErrorAction SilentlyContinue
    if ($null -eq $campo) {
        Add-PnPField -List $NombreLista -InternalName $NombreInterno -DisplayName $NombreVisible -Type $Tipo
    }
}

Crear-ListaSiNoExiste -NombreLista "Solicitudes" -Descripcion "Solicitudes internas y su estado actual"
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "Descripcion" -NombreVisible "Descripción" -Tipo Note
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "Categoria" -NombreVisible "Categoría" -Tipo Choice
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "Prioridad" -NombreVisible "Prioridad" -Tipo Choice
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "Estado" -NombreVisible "Estado" -Tipo Choice
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "Solicitante" -NombreVisible "Solicitante" -Tipo User
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "Aprobador" -NombreVisible "Aprobador" -Tipo User
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "FechaSolicitud" -NombreVisible "Fecha de solicitud" -Tipo DateTime
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "FechaDecision" -NombreVisible "Fecha de decisión" -Tipo DateTime
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "ComentarioDecision" -NombreVisible "Comentario de decisión" -Tipo Note
Crear-CampoSiNoExiste -NombreLista "Solicitudes" -NombreInterno "CodigoSeguimiento" -NombreVisible "Código de seguimiento" -Tipo Text

Crear-ListaSiNoExiste -NombreLista "HistorialSolicitudes" -Descripcion "Trazabilidad de cambios de las solicitudes"
Crear-CampoSiNoExiste -NombreLista "HistorialSolicitudes" -NombreInterno "SolicitudId" -NombreVisible "ID de solicitud" -Tipo Number
Crear-CampoSiNoExiste -NombreLista "HistorialSolicitudes" -NombreInterno "EstadoAnterior" -NombreVisible "Estado anterior" -Tipo Text
Crear-CampoSiNoExiste -NombreLista "HistorialSolicitudes" -NombreInterno "EstadoNuevo" -NombreVisible "Estado nuevo" -Tipo Text
Crear-CampoSiNoExiste -NombreLista "HistorialSolicitudes" -NombreInterno "Responsable" -NombreVisible "Responsable" -Tipo User
Crear-CampoSiNoExiste -NombreLista "HistorialSolicitudes" -NombreInterno "FechaEvento" -NombreVisible "Fecha del evento" -Tipo DateTime
Crear-CampoSiNoExiste -NombreLista "HistorialSolicitudes" -NombreInterno "Comentario" -NombreVisible "Comentario" -Tipo Note

Write-Host "Configuración finalizada. Revise los tipos Choice y sus opciones en SharePoint."

