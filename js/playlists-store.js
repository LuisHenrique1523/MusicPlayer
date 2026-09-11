const STORAGE_KEY = "music-player-playlists";

export const COVERS = [
  "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/be/82/8d/be828d78-406b-d911-62cb-3ef5e8e357cf/00602438625826_Cover.jpg/600x600bb.jpg",
  "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/9e/28/29/9e2829f5-f1de-b588-b14a-103c032a7b10/7891430250379.jpg/600x600bb.jpg",
  "https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/1f/0d/d8/1f0dd87e-d149-8636-2f86-8f92343d5092/7891430282226.tif/600x600bb.jpg",
  "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/de/b1/13/deb1133a-2388-c753-a5ad-4d4659cef9f9/7891430378028.jpg/600x600bb.jpg",
];

const ids = (...n) => n.map((i) => `t${i}`);

const defaultPlaylists = [
  { id: "p1", name: "Favoritas", description: "As que eu nunca pulo", cover: COVERS[0], trackIds: ids(1, 2, 5) },
  { id: "p2", name: "Treino", description: "Energia do começo ao fim", cover: COVERS[1], trackIds: ids(3, 5, 10) },
  { id: "p3", name: "Relax", description: "Para desacelerar", cover: COVERS[2], trackIds: ids(8, 9) },
  { id: "p4", name: "Viagem", description: "Estrada e horizonte", cover: COVERS[3], trackIds: ids(1, 4, 8, 10) },
  { id: "p5", name: "Modão de Raiz", description: "Sofrência do bom", cover: COVERS[0], trackIds: ids(7) },
  { id: "p6", name: "Top Sertanejo", description: "Os hits do momento", cover: COVERS[1], trackIds: ids(5, 6, 7) },
];

export function loadPlaylists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return defaultPlaylists.map((p) => ({ ...p }));
}

export function savePlaylists(lists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}
