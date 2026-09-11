import { fmt } from "../tracks.js";

export function mountHome(container, player) {
  container.className = "main main-home";
  container.innerHTML = `
    <p class="eyebrow">Tocando agora</p>
    <div class="now">
      <img class="cover" id="home-cover" alt="" width="800" height="800">
      <div class="meta">
        <h1 id="home-title"></h1>
        <p class="artist" id="home-artist"></p>
        <p class="album" id="home-album"></p>
        <ul class="tags">
          <li id="home-year"></li>
          <li id="home-genre"></li>
          <li id="home-duration"></li>
        </ul>
      </div>
    </div>
  `;

  const cover = container.querySelector("#home-cover");
  const title = container.querySelector("#home-title");
  const artist = container.querySelector("#home-artist");
  const album = container.querySelector("#home-album");
  const year = container.querySelector("#home-year");
  const genre = container.querySelector("#home-genre");
  const duration = container.querySelector("#home-duration");

  const render = () => {
    const t = player.track;
    cover.src = t.cover;
    cover.alt = `Capa do álbum ${t.album}`;
    title.textContent = t.title;
    artist.textContent = t.artist;
    album.textContent = t.album;
    year.textContent = t.year;
    genre.textContent = t.genre;
    duration.textContent = fmt(player.duration || t.duration);
  };

  player.addEventListener("trackchange", render);
  player.addEventListener("durationchange", render);
  render();

  return () => {
    player.removeEventListener("trackchange", render);
    player.removeEventListener("durationchange", render);
  };
}
