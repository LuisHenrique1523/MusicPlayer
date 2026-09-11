const items = [
  { to: "", label: "Início", icon: "⌂" },
  { to: "biblioteca", label: "Músicas", icon: "♪" },
  { to: "playlists", label: "Playlists", icon: "☰" },
];

export function mountBottomNav(container) {
  container.setAttribute("aria-label", "Navegação principal");
  container.innerHTML = items
    .map(
      (item) => `
      <a class="bottom-nav-item" data-route="${item.to}" href="#/${item.to}">
        <span class="bottom-nav-icon" aria-hidden="true">${item.icon}</span>
        <span class="bottom-nav-label">${item.label}</span>
      </a>`,
    )
    .join("");
}

export function updateBottomNav(container, route) {
  container.querySelectorAll(".bottom-nav-item").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.route === route);
  });
}
