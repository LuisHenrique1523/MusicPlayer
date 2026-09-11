import { fmt, tracks } from "../tracks.js";
import { COVERS, loadPlaylists, savePlaylists } from "../playlists-store.js";

export function mountPlaylists(container, player) {
  const state = {
    lists: loadPlaylists(),
    openId: null,
  };

  container.className = "main";
  container.innerHTML = `<div id="pl-content"></div>`;
  const content = container.querySelector("#pl-content");

  const persist = () => savePlaylists(state.lists);

  const songsOf = (list) =>
    list.trackIds.map((id) => tracks.find((t) => t.id === id)).filter(Boolean);

  function renderGrid() {
    content.innerHTML = `
      <div class="lib-head">
        <h1>Suas Playlists</h1>
        <button type="button" class="btn-accent" id="pl-create-open">+ Criar playlist</button>
      </div>
      <div class="pl-grid">
        ${state.lists
          .map(
            (l) => `
          <article class="pl-card" data-id="${l.id}">
            <div class="pl-card-cover"><img src="${l.cover}" alt="Capa da playlist ${l.name}" width="300" height="300"></div>
            <h2>${l.name}</h2>
            <p class="pl-count">${l.trackIds.length} músicas</p>
            <p class="pl-desc">${l.description}</p>
            <button type="button" class="btn-ghost" data-open="${l.id}">Abrir playlist</button>
          </article>`,
          )
          .join("")}
      </div>
    `;

    content.querySelector("#pl-create-open").addEventListener("click", openCreateModal);
    content.querySelectorAll("[data-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.openId = btn.dataset.open;
        renderMain();
      });
    });
  }

  function renderDetail() {
    const list = state.lists.find((l) => l.id === state.openId);
    if (!list) {
      state.openId = null;
      renderGrid();
      return;
    }
    const songs = songsOf(list);

    content.innerHTML = `
      <button type="button" class="btn-back" id="pl-back">← Voltar às playlists</button>
      <header class="pl-hero">
        <img src="${list.cover}" alt="Capa da playlist ${list.name}" width="400" height="400">
        <div class="pl-hero-meta">
          <p class="eyebrow">Playlist</p>
          <h1>${list.name}</h1>
          <p class="pl-desc">${list.description}</p>
          <p class="pl-count">${list.trackIds.length} músicas</p>
          <div class="pl-hero-actions">
            <button type="button" class="btn-accent" id="pl-play" ${list.trackIds.length ? "" : "disabled"}>▶ Play</button>
            <button type="button" class="btn-ghost" id="pl-add-open">Adicionar músicas</button>
          </div>
        </div>
      </header>
      <div class="lib-list" id="pl-detail-list"></div>
    `;

    const detailList = content.querySelector("#pl-detail-list");

    const renderDetailList = () => {
      const rowsHtml = songs
        .map((t, i) => {
          const isCurrent = t.id === player.track.id;
          return `
          <div class="lib-row${isCurrent ? " is-current" : ""}" data-id="${t.id}">
            <span class="col-num">${isCurrent && player.playing ? "▮▮" : i + 1}</span>
            <div class="col-title">
              <img src="${t.cover}" alt="" width="40" height="40">
              <span class="col-title-meta"><strong>${t.title}</strong><small>${t.artist}</small></span>
            </div>
            <span class="col-album">${t.album}</span>
            <span class="col-time">${fmt(t.duration)}</span>
            <span class="row-actions">
              <button type="button" class="row-play" data-play="${t.id}" aria-label="Tocar ${t.title}">${isCurrent && player.playing ? "❚❚" : "▶"}</button>
              <button type="button" class="row-remove" data-remove="${t.id}" aria-label="Remover ${t.title} da playlist">✕</button>
            </span>
          </div>`;
        })
        .join("");

      detailList.innerHTML = `
        <div class="lib-row lib-row-head">
          <span class="col-num">#</span>
          <span>Título</span>
          <span class="col-album">Álbum</span>
          <span class="col-time">Duração</span>
          <span></span>
        </div>
        ${rowsHtml || `<p class="lib-empty">Nenhuma música ainda. Use "Adicionar músicas".</p>`}
      `;
    };

    detailList.addEventListener("click", (e) => {
      const playBtn = e.target.closest("[data-play]");
      if (playBtn) player.toggleTrack(playBtn.dataset.play);
      const removeBtn = e.target.closest("[data-remove]");
      if (removeBtn) {
        list.trackIds = list.trackIds.filter((id) => id !== removeBtn.dataset.remove);
        persist();
        renderDetail();
      }
    });

    content.querySelector("#pl-back").addEventListener("click", () => {
      state.openId = null;
      renderGrid();
    });

    content.querySelector("#pl-play").addEventListener("click", () => {
      if (list.trackIds[0]) player.playTrack(list.trackIds[0]);
    });

    content.querySelector("#pl-add-open").addEventListener("click", () => openAddModal(list));

    const onPlayerChange = () => renderDetailList();
    player.addEventListener("trackchange", onPlayerChange);
    player.addEventListener("playstate", onPlayerChange);
    detailCleanup = () => {
      player.removeEventListener("trackchange", onPlayerChange);
      player.removeEventListener("playstate", onPlayerChange);
    };

    renderDetailList();
  }

  let detailCleanup = null;

  function renderMain() {
    if (detailCleanup) {
      detailCleanup();
      detailCleanup = null;
    }
    if (state.openId) renderDetail();
    else renderGrid();
  }

  function closeModal() {
    const back = document.querySelector(".modal-back");
    if (back) back.remove();
  }

  function openCreateModal() {
    const form = { name: "", description: "", cover: COVERS[0] };
    const back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = `
      <div class="modal" role="dialog" aria-label="Nova playlist">
        <h2>Nova playlist</h2>
        <label class="field"><span>Nome</span><input id="pl-form-name" placeholder="Ex: Domingo lento"></label>
        <label class="field"><span>Descrição</span><input id="pl-form-desc" placeholder="Uma frase sobre a playlist"></label>
        <div class="field">
          <span>Capa</span>
          <div class="cover-pick">
            ${COVERS.map(
              (c, i) => `<button type="button" class="cover-opt${i === 0 ? " is-on" : ""}" data-cover="${c}" aria-label="Escolher capa"><img src="${c}" alt="" width="64" height="64"></button>`,
            ).join("")}
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-ghost" id="pl-form-cancel">Cancelar</button>
          <button type="button" class="btn-accent" id="pl-form-create">Criar</button>
        </div>
      </div>
    `;
    document.body.appendChild(back);

    back.addEventListener("click", (e) => {
      if (e.target === back) closeModal();
    });
    back.querySelector("#pl-form-cancel").addEventListener("click", closeModal);
    back.querySelectorAll(".cover-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        form.cover = btn.dataset.cover;
        back.querySelectorAll(".cover-opt").forEach((b) => b.classList.toggle("is-on", b === btn));
      });
    });
    back.querySelector("#pl-form-create").addEventListener("click", () => {
      const name = back.querySelector("#pl-form-name").value.trim();
      if (!name) return;
      const description = back.querySelector("#pl-form-desc").value.trim() || "Playlist criada por você";
      const pl = { id: `p${Date.now()}`, name, description, cover: form.cover, trackIds: [] };
      state.lists = [pl, ...state.lists];
      persist();
      state.openId = pl.id;
      closeModal();
      renderMain();
    });
  }

  function openAddModal(list) {
    const back = document.createElement("div");
    back.className = "modal-back";

    const renderItems = () =>
      tracks
        .map((t) => {
          const inList = list.trackIds.includes(t.id);
          return `
          <li>
            <img src="${t.cover}" alt="" width="40" height="40">
            <span class="col-title-meta"><strong>${t.title}</strong><small>${t.artist}</small></span>
            <button type="button" class="btn-ghost" data-add="${t.id}" ${inList ? "disabled" : ""}>${inList ? "Adicionada" : "+ Adicionar"}</button>
          </li>`;
        })
        .join("");

    back.innerHTML = `
      <div class="modal" role="dialog" aria-label="Adicionar músicas">
        <h2>Adicionar músicas</h2>
        <ul class="add-list" id="pl-add-list">${renderItems()}</ul>
        <div class="modal-actions">
          <button type="button" class="btn-accent" id="pl-add-done">Concluir</button>
        </div>
      </div>
    `;
    document.body.appendChild(back);

    const listEl = back.querySelector("#pl-add-list");
    back.addEventListener("click", (e) => {
      if (e.target === back) {
        closeModal();
        renderMain();
      }
    });
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-add]");
      if (!btn || btn.disabled) return;
      if (!list.trackIds.includes(btn.dataset.add)) list.trackIds.push(btn.dataset.add);
      persist();
      listEl.innerHTML = renderItems();
    });
    back.querySelector("#pl-add-done").addEventListener("click", () => {
      closeModal();
      renderMain();
    });
  }

  renderMain();

  return () => {
    if (detailCleanup) detailCleanup();
    closeModal();
  };
}
