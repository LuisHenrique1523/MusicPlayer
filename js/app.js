import { tracks } from "./tracks.js";
import { Player } from "./player.js";
import { mountPlayerBar } from "./views/playerbar.js";
import { mountBottomNav } from "./views/bottomnav.js";
import { startRouter } from "./router.js";

const audioEl = document.getElementById("audio");
const player = new Player(audioEl, tracks);

mountPlayerBar(document.getElementById("player-bar"), player);
mountBottomNav(document.getElementById("bottom-nav"));

startRouter(player, {
  sidebarEl: document.getElementById("sidebar"),
  mainEl: document.getElementById("main-content"),
  bottomNavEl: document.getElementById("bottom-nav"),
});
