import { fmt } from "../tracks.js";

export function mountPlayerBar(container, player) {
  container.innerHTML = `
    <div class="player-track">
      <img id="pb-cover" width="56" height="56" alt="">
      <div class="player-track-meta">
        <strong id="pb-title"></strong>
        <span id="pb-artist"></span>
      </div>
    </div>
    <div class="player-center">
      <div class="controls">
        <button type="button" class="ctrl" id="pb-shuffle" aria-label="Modo aleatório">⤨</button>
        <button type="button" class="ctrl" id="pb-prev" aria-label="Música anterior">⏮</button>
        <button type="button" class="ctrl ctrl-play" id="pb-toggle" aria-label="Play ou pause">▶</button>
        <button type="button" class="ctrl" id="pb-next" aria-label="Próxima música">⏭</button>
        <button type="button" class="ctrl" id="pb-repeat" aria-label="Repetição">↻</button>
      </div>
      <div class="progress-row">
        <span class="time" id="pb-current">0:00</span>
        <input class="range" id="pb-progress" type="range" min="0" max="100" step="0.1" value="0" aria-label="Barra de progresso">
        <span class="time" id="pb-duration">0:00</span>
      </div>
    </div>
    <div class="player-volume">
      <button type="button" class="ctrl" id="pb-mute" aria-label="Silenciar">🔊</button>
      <input class="range range-vol" id="pb-volume" type="range" min="0" max="1" step="0.01" value="0.8" aria-label="Controle de volume">
    </div>
  `;

  const el = (id) => container.querySelector(id);
  const cover = el("#pb-cover");
  const title = el("#pb-title");
  const artist = el("#pb-artist");
  const shuffleBtn = el("#pb-shuffle");
  const prevBtn = el("#pb-prev");
  const toggleBtn = el("#pb-toggle");
  const nextBtn = el("#pb-next");
  const repeatBtn = el("#pb-repeat");
  const currentTime = el("#pb-current");
  const durationTime = el("#pb-duration");
  const progress = el("#pb-progress");
  const muteBtn = el("#pb-mute");
  const volume = el("#pb-volume");

  const renderTrack = () => {
    const t = player.track;
    cover.src = t.cover;
    title.textContent = t.title;
    artist.textContent = t.artist;
  };

  const renderPlaystate = () => {
    toggleBtn.textContent = player.playing ? "❚❚" : "▶";
  };

  const renderProgress = () => {
    const pct = player.duration ? (player.current / player.duration) * 100 : 0;
    progress.value = String(pct);
    progress.style.setProperty("--fill", `${pct}%`);
    currentTime.textContent = fmt(player.current);
  };

  const renderDuration = () => {
    durationTime.textContent = fmt(player.duration);
    renderProgress();
  };

  const renderToggles = () => {
    shuffleBtn.classList.toggle("is-on", player.shuffle);
    repeatBtn.classList.toggle("is-on", player.repeat !== "off");
    repeatBtn.textContent = player.repeat === "one" ? "↻¹" : "↻";
  };

  const renderVolume = () => {
    const pct = player.muted ? 0 : player.volume * 100;
    volume.value = String(player.muted ? 0 : player.volume);
    volume.style.setProperty("--fill", `${pct}%`);
    muteBtn.textContent = player.muted || player.volume === 0 ? "🔇" : "🔊";
  };

  shuffleBtn.addEventListener("click", () => player.setShuffle(!player.shuffle));
  prevBtn.addEventListener("click", () => player.prev());
  toggleBtn.addEventListener("click", () => player.toggle());
  nextBtn.addEventListener("click", () => player.next(false));
  repeatBtn.addEventListener("click", () => player.cycleRepeat());
  muteBtn.addEventListener("click", () => player.setMuted(!player.muted));
  progress.addEventListener("input", (e) => player.seekPercent(Number(e.target.value)));
  volume.addEventListener("input", (e) => {
    const v = Number(e.target.value);
    player.setVolume(v);
    player.setMuted(v === 0);
  });

  player.addEventListener("trackchange", renderTrack);
  player.addEventListener("playstate", renderPlaystate);
  player.addEventListener("timeupdate", renderProgress);
  player.addEventListener("durationchange", renderDuration);
  player.addEventListener("togglechange", renderToggles);
  player.addEventListener("volumechange", renderVolume);

  renderTrack();
  renderPlaystate();
  renderProgress();
  renderDuration();
  renderToggles();
  renderVolume();
}
