// Simple client-side router
function navigate(path) {
  history.pushState(null, null, path);
  handleRoute();
}

function handleRoute() {
  const path = window.location.pathname;

  // Home → show list
  if (path === "/" || path === "") {
    renderList();
    return;
  }

  // Detail page → /collection/slug
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 2) {
    const [collection, slug] = parts;
    renderDetail(collection, slug);
    return;
  }

  // Fallback
  render404();
}

// Catch clicks on <a data-link>
document.addEventListener("click", e => {
  const link = e.target.closest("a[data-link]");
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute("href"));
  }
});

// Handle back/forward
window.addEventListener("popstate", handleRoute);

// Export global for app.js
window.handleRoute = handleRoute;
