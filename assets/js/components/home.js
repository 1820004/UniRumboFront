// assets/js/pages/home.js

// ------- Datos demo (por si aún no conectas API) -------
const demoRoutes = [
  {
    titulo: "Ruta - Universidad",
    conductor: "Nombre",
    origen: "Centro de la ciudad",
    destino: "Campus Principal",
    vehiculo: "Carro",
    cupos: 12,
    horario: "Salida: 07:00 AM - Regreso: 06:00 PM",
    precio: "$8000"
  },
  {
    titulo: "Ruta - Universidad",
    conductor: "Nombre",
    origen: "Zona Norte",
    destino: "Campus Norte",
    vehiculo: "Carro",
    cupos: 20,
    horario: "Salida: 06:30 AM - Regreso: 05:30 PM",
    precio: "$10000"
  }
];

const demoHousing = [
  {
    titulo: "Alojamiento - Residencia A",
    conductor: "Administrador",
    origen: "Cerca del Campus",
    destino: "Residencia A",
    vehiculo: "—",
    cupos: 5,
    horario: "Ingreso 24/7",
    precio: "$350000 / mes"
  }
];

// ------- Templates -------
function cardTemplate(svc){
  // Icono según el tipo (muy simple: si el título contiene Alojamiento)
  const isHousing = (svc.titulo || "").toLowerCase().includes("alojamiento");
  const icon = isHousing ? "🏠" : "🚗";

  return `
  <article class="service-card">
    <div class="head">${icon} <span>${svc.titulo}</span></div>
    <div class="meta">Conductor: ${svc.conductor}</div>
    <ul class="list">
      <li>📍 <span>Origen: ${svc.origen}</span></li>
      <li>📍 <span>Destino: ${svc.destino}</span></li>
      <li>🚘 <span>${svc.vehiculo}</span></li>
      <li>👥 <span>${svc.cupos} cupos disponibles</span></li>
      <li>🕒 <span>${svc.horario}</span></li>
      <li>💲 <span>Precio: ${svc.precio}</span></li>
    </ul>
    <div class="card-actions">
      <button class="btn btn--light">Ver detalles</button>
      <button class="btn btn--dark">Aplicar</button>
    </div>
  </article>`;
}

function renderList(el, data){
  if (!el) return;
  el.innerHTML = data.map(cardTemplate).join("");
}

// ------- Tabs (lo que necesitas) -------
export function initHomeTabs(){
  const buttons = document.querySelectorAll(".seg-btn");
  const panes   = document.querySelectorAll(".tab-pane");
  const routeEl   = document.getElementById("route");
  const housingEl = document.getElementById("housing");

  if (!buttons.length || !panes.length) {
    console.warn("[home] No encontré botones o panes de tabs");
    return;
  }

  // Si la pestaña de alojamiento está vacía, la llenaremos al primer click
  let housingRendered = !!(housingEl && housingEl.querySelector(".service-card"));

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Apagar todos los botones y panes
      buttons.forEach(b => b.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));

      // Activar el botón clicado y su pane
      btn.classList.add("active");
      const id = btn.dataset.tab; // "route" | "housing"
      const pane = document.getElementById(id);
      if (pane) pane.classList.add("active");

      // Si se activó housing y está vacío, render demo de alojamiento
      if (id === "housing" && housingEl && !housingRendered) {
        renderList(housingEl.querySelector(".cards-2col") || housingEl, demoHousing);
        housingRendered = true;
      }

      // (Opcional) si quieres limpiar rutas cuando se ve housing:
      // if (id === "housing" && routeEl) routeEl.innerHTML = "";
    });
  });

  // Estado inicial (por si quieres activar por hash #housing)
  if (location.hash === "#housing") {
    const housingBtn = document.querySelector('.seg-btn[data-tab="housing"]');
    housingBtn?.click();
  }
}

/* (Opcional) Si luego quieres popular desde JS en vez de HTML estático:
export function initHomeData(){
  renderList(document.getElementById("route")?.querySelector(".cards-2col") || document.getElementById("route"), demoRoutes);
  renderList(document.getElementById("housing")?.querySelector(".cards-2col") || document.getElementById("housing"), demoHousing);
}
*/
