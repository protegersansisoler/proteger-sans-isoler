async function inject(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.warn(`[include] Impossible de charger ${file}:`, err);
  }
}

function normalizeHref(href) {
  if (!href) return "";
  return href
    .split("#")[0]
    .split("?")[0]
    .replace(/^\.\//, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

function getCurrentPage() {
  const last = location.pathname.split("/").filter(Boolean).pop() || "index.html";
  const current = normalizeHref(last);
  return current.includes(".") ? current : "index.html";
}

function markActiveLink() {
  const current = getCurrentPage();

  document.querySelectorAll(".menu a").forEach(a => {
    const href = normalizeHref(a.getAttribute("href"));
    if (href === current) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await inject("site-header", "header.html");
  await inject("site-footer", "footer.html");
  markActiveLink(); // important : après injection
});
