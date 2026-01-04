async function inject(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const html = await res.text();
    el.innerHTML = html;
  } catch (err) {
    // Fallback silencieux (évite de casser la page si un include manque)
    console.warn(`[include] Impossible de charger ${file}:`, err);
  }
}

function normalizeHref(href) {
  if (!href) return "";

  // Enlever paramètres et ancres
  href = href.split("#")[0].split("?")[0];

  // Enlever ./ au début
  href = href.replace(/^\.\//, "");

  // Normaliser slash final (ex: dossier/ -> dossier)
  href = href.replace(/\/$/, "");

  return href.toLowerCase();
}

function getCurrentPage() {
  // GitHub Pages + chemins variés : on prend le dernier segment
  const last = location.pathname.split("/").filter(Boolean).pop() || "index.html";
  const current = normalizeHref(last);

  // Si l’URL finit par un dossier (rare mais possible) : fallback index.html
  if (!current.includes(".")) return "index.html";

  return current;
}

function markActiveLink() {
  const current = getCurrentPage();

  document.querySelectorAll(".menu a").forEach(a => {
    const href = normalizeHref(a.getAttribute("href"));

    if (href === current) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await inject("site-header", "header.html");
  await inject("site-footer", "footer.html");

  // Important : appeler après injection (menu présent)
  markActiveLink();
});
