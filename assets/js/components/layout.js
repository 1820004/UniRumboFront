// assets/js/components/layout.js

// Construye la URL del header PARTIENDO de este archivo (layout.js)
// layout.js está en: assets/js/components/layout.js
// header.html está en: assets/components/header.html
// => subir 2 niveles desde layout.js hasta /assets y luego /components/header.html
const HEADER_URL = new URL("../../components/header.html", import.meta.url).toString();

// Para logout: queremos volver a /index.html en la RAÍZ del proyecto
// Desde layout.js (assets/js/components) → subir 3 niveles hasta raíz → index.html
const LOGIN_URL = new URL("../../../index.html", import.meta.url).toString();

export async function mountLayout(activeKey = "") {
  const host = document.getElementById("app-header");
  if (!host) {
    console.error("[layout] No existe #app-header en el DOM");
    return;
  }

  // Carga del fragmento sin cache
  let html;
  try {
    console.log("[layout] Cargando header desde:", HEADER_URL);
    const res = await fetch(HEADER_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    console.error("[layout] No se pudo cargar el header:", e);
    host.innerHTML =
      '<div style="padding:12px;color:#b00;background:#fee;border:1px solid #f99;border-radius:8px;">No se pudo cargar el menú. Revisa la ruta y que estés usando un servidor local.</div>';
    return;
  }

  host.innerHTML = html;

  // Marcar pestaña activa según data-nav
  if (activeKey) {
    let found = false;
    host.querySelectorAll(".navlink").forEach((a) => {
      if (a.dataset.nav === activeKey) {
        a.classList.add("active");
        found = true;
      }
    });
    if (!found) console.warn("[layout] No encontré data-nav=", activeKey);
  }

  // Pintar nombre de usuario (si existe)
  const span = host.querySelector("#userName");
  if (span) span.textContent = localStorage.getItem("userName") || "Nombre Cliente";

  // Logout → limpia y redirige a login
  const logout = host.querySelector("#logoutBtn");
  if (logout) {
    logout.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      location.href = LOGIN_URL;
    });
  }
}
