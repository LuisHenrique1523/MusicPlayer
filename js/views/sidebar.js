export function mountSidebar(container, player, { route, showQueue = true }) {
  const items = [
    { to: "", icon: "⌂", label: "Início" },
    { to: "biblioteca", icon: "☰", label: "Biblioteca" },
    { to: "playlists", icon: "♪", label: "Playlists" },
  ];

  const navHtml = items
    .map(
      (item) => `
      <a class="nav-item${item.to === route ? " is-active" : ""}" href="#/${item.to}">
        <span class="ico">${item.icon}</span> ${item.label}
      </a>`,
    )
    .join("");

  container.innerHTML = `
    <div class="brand">
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="currentColor"></circle>
        <path d="M7 15V8.2l9-1.6v6.8" fill="none" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round"></path>
        <circle cx="6.2" cy="15.4" r="1.9" fill="#0a0a0a"></circle>
        <circle cx="15.2" cy="13.6" r="1.9" fill="#0a0a0a"></circle>
      </svg>
      <span>Music Player</span>
    </div>
    <nav class="nav">${navHtml}</nav>
    ${showQueue ? `<div class="playlist"><p class="playlist-title">Na fila</p><ul class="queue"></ul></div>` : ""}
  `;

  if (!showQueue) return () => {};

  const queueEl = container.querySelector(".queue");

  const renderQueue = () => {
    queueEl.innerHTML = player.tracks
      .map(
        (t, i) => `<li data-index="${i}" class="${i === player.index ? "is-playing" : ""}">${t.title} — ${t.artist}</li>`,
      )
      .join("");
  };

  queueEl.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-index]");
    if (li) player.playIndex(Number(li.dataset.index));
  });

  const onTrackChange = () => renderQueue();
  player.addEventListener("trackchange", onTrackChange);
  renderQueue();

  return () => player.removeEventListener("trackchange", onTrackChange);
}
