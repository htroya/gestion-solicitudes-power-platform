const CLAVE_ALMACENAMIENTO = "solicitudes-power-platform";

const formularioSolicitud = document.querySelector("#formularioSolicitud");
const listaSolicitudes = document.querySelector("#listaSolicitudes");
const plantillaSolicitud = document.querySelector("#plantillaSolicitud");
const filtroEstado = document.querySelector("#filtroEstado");
const resumen = document.querySelector("#resumen");
const botonReiniciar = document.querySelector("#botonReiniciar");

let solicitudes = cargarSolicitudes();

function crearDatosIniciales() {
  return [
    {
      id: 1,
      codigo: "SOL-20260721-00001",
      asunto: "Acceso al tablero de indicadores",
      categoria: "Acceso",
      prioridad: "Media",
      descripcion: "Solicito acceso de lectura para revisar los indicadores mensuales del área.",
      estado: "Pendiente",
      fecha: "2026-07-21T09:00:00",
      historial: ["21/07/2026, 09:00 · Solicitud registrada y enviada a aprobación"]
    }
  ];
}

function cargarSolicitudes() {
  const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);
  return datosGuardados ? JSON.parse(datosGuardados) : crearDatosIniciales();
}

function guardarSolicitudes() {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(solicitudes));
}

function generarCodigo(id) {
  const fecha = new Date();
  const parteFecha = [fecha.getFullYear(), fecha.getMonth() + 1, fecha.getDate()]
    .map(valor => String(valor).padStart(2, "0"))
    .join("");
  return `SOL-${parteFecha}-${String(id).padStart(5, "0")}`;
}

function formatearFecha(fechaIso) {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(fechaIso));
}

function registrarSolicitud(evento) {
  evento.preventDefault();
  const datos = new FormData(formularioSolicitud);
  const nuevoId = solicitudes.reduce((mayor, solicitud) => Math.max(mayor, solicitud.id), 0) + 1;
  const ahora = new Date();

  solicitudes.unshift({
    id: nuevoId,
    codigo: generarCodigo(nuevoId),
    asunto: datos.get("asunto").trim(),
    categoria: datos.get("categoria"),
    prioridad: datos.get("prioridad"),
    descripcion: datos.get("descripcion").trim(),
    estado: "Pendiente",
    fecha: ahora.toISOString(),
    historial: [`${formatearFecha(ahora)} · Solicitud registrada y enviada a aprobación`]
  });

  guardarSolicitudes();
  formularioSolicitud.reset();
  mostrarSolicitudes();
}

function decidirSolicitud(id, nuevoEstado) {
  const solicitud = solicitudes.find(elemento => elemento.id === id);
  if (!solicitud || solicitud.estado !== "Pendiente") return;

  const accion = nuevoEstado === "Aprobada" ? "aprobada" : "rechazada";
  const comentario = window.prompt(`Comentario de la solicitud ${accion}:`, "Revisado en la demo");
  if (comentario === null) return;

  solicitud.estado = nuevoEstado;
  solicitud.historial.unshift(`${formatearFecha(new Date())} · Solicitud ${accion}: ${comentario || "Sin comentario"}`);
  guardarSolicitudes();
  mostrarSolicitudes();
}

function mostrarSolicitudes() {
  const estadoSeleccionado = filtroEstado.value;
  const solicitudesVisibles = solicitudes.filter(solicitud =>
    estadoSeleccionado === "Todos" || solicitud.estado === estadoSeleccionado
  );

  listaSolicitudes.replaceChildren();
  resumen.textContent = `${solicitudes.length} solicitud${solicitudes.length === 1 ? "" : "es"} registrada${solicitudes.length === 1 ? "" : "s"}`;

  if (solicitudesVisibles.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "vacio";
    mensaje.textContent = "No hay solicitudes para este filtro.";
    listaSolicitudes.append(mensaje);
    return;
  }

  solicitudesVisibles.forEach(solicitud => {
    const fragmento = plantillaSolicitud.content.cloneNode(true);
    fragmento.querySelector(".codigo").textContent = solicitud.codigo;
    fragmento.querySelector(".asunto").textContent = solicitud.asunto;
    fragmento.querySelector(".descripcion").textContent = solicitud.descripcion;

    const etiquetaEstado = fragmento.querySelector(".estado");
    etiquetaEstado.textContent = solicitud.estado;
    etiquetaEstado.classList.add(`estado-${solicitud.estado.toLowerCase()}`);

    fragmento.querySelector(".metadatos").textContent =
      `${solicitud.categoria} · Prioridad ${solicitud.prioridad.toLowerCase()} · ${formatearFecha(solicitud.fecha)}`;

    const acciones = fragmento.querySelector(".acciones");
    if (solicitud.estado !== "Pendiente") {
      acciones.remove();
    } else {
      acciones.querySelector(".boton-aprobar").addEventListener("click", () => decidirSolicitud(solicitud.id, "Aprobada"));
      acciones.querySelector(".boton-rechazar").addEventListener("click", () => decidirSolicitud(solicitud.id, "Rechazada"));
    }

    const historial = fragmento.querySelector(".historial");
    solicitud.historial.forEach(evento => {
      const elemento = document.createElement("li");
      elemento.textContent = evento;
      historial.append(elemento);
    });

    listaSolicitudes.append(fragmento);
  });
}

function reiniciarDemo() {
  if (!window.confirm("¿Desea eliminar los cambios locales y restablecer la demo?")) return;
  solicitudes = crearDatosIniciales();
  guardarSolicitudes();
  filtroEstado.value = "Todos";
  mostrarSolicitudes();
}

formularioSolicitud.addEventListener("submit", registrarSolicitud);
filtroEstado.addEventListener("change", mostrarSolicitudes);
botonReiniciar.addEventListener("click", reiniciarDemo);
mostrarSolicitudes();

