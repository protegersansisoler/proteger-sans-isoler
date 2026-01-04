async function inject(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(file, { cache: "no-store" });
  const html = await res.text();
  el.innerHTML = html;
}

function markActiveLink() {
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".menu a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
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
  markActiveLink();
});
