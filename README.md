# Music Player

Player de música construído apenas com HTML, CSS e JavaScript puro (sem frameworks, sem build step).

## Funcionalidades

- Reprodução com play/pause, próxima/anterior, aleatório e repetição (desligado/tudo/uma música)
- Barra de progresso e controle de volume
- Biblioteca com busca, filtro por categoria e ordenação
- Playlists: criar, abrir, tocar, adicionar e remover músicas (salvas no `localStorage`)
- Navegação por hash (`#/`, `#/biblioteca`, `#/playlists`) sem recarregar a página, então a música continua tocando ao trocar de tela
- Layout responsivo com navegação inferior no mobile

## Estrutura

```
index.html            estrutura da página (sidebar, área principal, player, navegação)
css/styles.css        todo o estilo (tema dark)
js/tracks.js          dados das faixas
js/player.js          lógica de reprodução (classe Player em cima do <audio>)
js/playlists-store.js persistência das playlists no localStorage
js/router.js          navegação por hash entre as telas
js/views/             telas e componentes (sidebar, player bar, biblioteca, playlists, etc.)
public/               capas dos álbuns, favicon, robots.txt
```

## Rodando localmente

Não há build nem dependências. Basta servir os arquivos estáticos, por exemplo:

```sh
npx serve .
```

Ou abra `index.html` diretamente no navegador (alguns navegadores restringem `fetch`/módulos ES em `file://`; um servidor local evita esse problema).
