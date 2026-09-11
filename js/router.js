import { mountSidebar } from "./views/sidebar.js";
import { mountHome } from "./views/home.js";
import { mountLibrary } from "./views/library.js";
import { mountPlaylists } from "./views/playlists.js";
import { updateBottomNav } from "./views/bottomnav.js";

const routes = {
  "": { mount: mountHome, showQueue: true, title: "Music Player — Player de música moderno" },
  biblioteca: { mount: mountLibrary, showQueue: false, title: "Sua Biblioteca — Music Player" },
  playlists: { mount: mountPlaylists, showQueue: false, title: "Suas Playlists — Music Player" },
};

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  return routes[hash] ? hash : "";
}

export function startRouter(player, { sidebarEl, mainEl, bottomNavEl }) {
  let cleanupSidebar = null;
  let cleanupMain = null;

  const render = () => {
    const route = currentRoute();
    const config = routes[route];

    if (cleanupSidebar) cleanupSidebar();
    if (cleanupMain) cleanupMain();

    document.title = config.title;
    cleanupSidebar = mountSidebar(sidebarEl, player, { route, showQueue: config.showQueue });
    cleanupMain = config.mount(mainEl, player);
    updateBottomNav(bottomNavEl, route);
  };

  window.addEventListener("hashchange", render);
  render();
}
