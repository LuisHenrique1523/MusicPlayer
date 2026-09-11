import { fmt } from "../tracks.js";

const categories = [
  { id: "todas", label: "Todas" },
  { id: "musica", label: "Músicas" },
  { id: "album", label: "Álbuns" },
  { id: "artista", label: "Artistas" },
];

export function mountLibrary(container, player) {
  const state = { query: "", category: "todas", sort: "title" };

  container.className = "main main-library";
  container.innerHTML = `
    <header class="lib-head">
      <h1 class="lib-title">Sua Biblioteca</h1>
      <div class="lib-tools">
        <input class="lib-search" type="search" id="lib-search" placeholder="Pesquisar música, artista ou álbum" aria-label="Pesquisar na biblioteca">
        <label class="lib-sort">
          <span>Ordenar</span>
          <select id="lib-sort">
            <option value="title">Título</option>
            <option value="artist">Artista</option>
            <option value="album">Álbum</option>
            <option value="duration">Duração</option>
          </select>
        </label>
      </div>
    </header>
    <div class="chips" role="tablist" aria-label="Categorias" id="lib-chips">
      ${categories
        .map(
          (c) => `<button type="button" role="tab" data-id="${c.id}" class="chip${c.id === "todas" ? " is-on" : ""}" aria-selected="${c.id === "todas"}">${c.label}</button>`,
        )
        .join("")}
    </div>
    <div class="lib-list" id="lib-list"></div>
  `;

  const searchEl = container.querySelector("#lib-search");
  const sortEl = container.querySelector("#lib-sort");
  const chipsEl = container.querySelector("#lib-chips");
  const listEl = container.querySelector("#lib-list");

  const getList = () => {
    const q = state.query.trim().toLowerCase();
    return player.tracks
      .filter((t) => (state.category === "todas" ? true : t.kind === state.category))
      .filter((t) => (!q ? true : `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(q)))
      .slice()
      .sort((a, b) =>
        state.sort === "duration" ? a.duration - b.duration : a[state.sort].localeCompare(b[state.sort], "pt-BR"),
      );
  };

  const renderList = () => {
    const list = getList();
    const rowsHtml = list
      .map((t, i) => {
        const isCurrent = t.id === player.track.id;
        const isPlayingIcon = isCurrent && player.playing ? "❚❚" : "▶";
        return `
        <div class="lib-row${isCurrent ? " is-current" : ""}" data-id="${t.id}">
          <span class="col-num">${i + 1}</span>
          <span class="col-title">
            <img src="${t.cover}" alt="" width="40" height="40">
            <span class="col-title-meta">
              <strong>${t.title}</strong>
              <small>${t.artist}</small>
            </span>
          </span>
          <span class="col-album">${t.album}</span>
          <span class="col-time">${fmt(t.duration)}</span>
          <button type="button" class="row-play" data-id="${t.id}" aria-label="${isCurrent && player.playing ? `Pausar ${t.title}` : `Reproduzir ${t.title}`}">${isPlayingIcon}</button>
        </div>`;
      })
      .join("");

    listEl.innerHTML = `
      <div class="lib-row lib-row-head">
        <span>#</span>
        <span>Título</span>
        <span class="col-album">Álbum</span>
        <span class="col-time">Duração</span>
        <span></span>
      </div>
      ${rowsHtml || `<p class="lib-empty">Nenhuma música encontrada.</p>`}
    `;
  };

  searchEl.addEventListener("input", (e) => {
    state.query = e.target.value;
    renderList();
  });

  sortEl.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderList();
  });

  chipsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    state.category = btn.dataset.id;
    chipsEl.querySelectorAll(".chip").forEach((c) => {
      const on = c.dataset.id === state.category;
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-selected", String(on));
    });
    renderList();
  });

  listEl.addEventListener("dblclick", (e) => {
    const row = e.target.closest(".lib-row[data-id]");
    if (row) player.toggleTrack(row.dataset.id);
  });

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".row-play[data-id]");
    if (btn) player.toggleTrack(btn.dataset.id);
  });

  const onPlayerChange = () => renderList();
  player.addEventListener("trackchange", onPlayerChange);
  player.addEventListener("playstate", onPlayerChange);

  renderList();

  return () => {
    player.removeEventListener("trackchange", onPlayerChange);
    player.removeEventListener("playstate", onPlayerChange);
  };
}
