async function inject(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const html = await res.text();
    el.innerHTML = html;
  } catch (err) {
    console.warn(`[include] Impossible de charger ${file}:`, err);
  }
}

function normalizeHref(href) {
  if (!href) return "";

  // Enlever paramètres et ancres
  href = href.split("#")[0].split("?")[0];

  // Enlever ./ au début
  href = href.replace(/^\.\//, "");

  // Enlever slash final (dossier/)
  href = href.replace(/\/$/, "");

  return href.toLowerCase();
}

function getCurrentPage() {
  // dernier segment du chemin
  const last = location.pathname.split("/").filter(Boolean).pop() || "index.html";
  const current = normalizeHref(last);

  // si l’URL finit par un dossier (sans .html), on traite comme index.html
  if (!current.includes(".")) return "index.html";

  return current;
}

function markActiveLink() {
  const current = getCurrentPage();

  document.querySelectorAll(".menu a").forEach(a => {
    const href = normalizeHref(a.getAttribute("href"));

    // si lien vide, on ignore
    if (!href) return;

    // gérer le cas "./" -> index.html
    const resolvedHref = (href === "" || href === ".") ? "index.html" : href;

    if (resolvedHref === current) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await inject("site-header", "header.html");
  await inject("site-footer", "footer.html");

  // menu présent seulement après injection
  markActiveLink();
});

