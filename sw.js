// Service worker partage entre les deux PWAs Saint-Maurice (complete et mobile).
//
// Strategies :
//   - app shell (HTML + manifests + favicons + icones PWA + image de fond)
//     => cache-first : sert depuis le cache, met a jour en arriere-plan a l'install
//   - donnees (data/sommaire.json, data/AAAA-MM-horaire.json, data/manifest.json)
//     => stale-while-revalidate : sert immediatement la version cachee (rapide,
//        meme hors-ligne), puis met a jour en arriere-plan si le reseau repond
//   - tout le reste => passthrough reseau direct
//
// Pour invalider le cache app shell apres un changement de HTML/asset :
// bumper CACHE_VERSION ci-dessous. Les anciens caches sont purges a l'activate.
//
// Convention semver (hq-sm-vMAJOR.MINOR.PATCH) :
//   MAJOR : breaking change (renommage de SHELL_CACHE/DATA_CACHE, nouvelle
//           strategie de cache, structure du SW completement repensee).
//   MINOR : ajout/retrait d'asset dans SHELL_ASSETS, changement de manifest
//           a livrer, modification du comportement d'install/activate.
//   PATCH : ajustement mineur (fix logique fetch, typo, commentaire) sans
//           toucher a la liste d'assets ni au comportement utilisateur.

// Cette ligne est REECRITE a chaque build par scripts/render-animation.ps1 a
// partir de data/pwa/version.json. La valeur ci-dessous est juste un placeholder
// pour developpement local et lecture du source - ne pas modifier directement,
// modifier version.json et lancer render-animation.ps1.
const CACHE_VERSION = 'hq-sm-v2.1.0';
const SHELL_CACHE = CACHE_VERSION + '-shell';
const DATA_CACHE  = CACHE_VERSION + '-data';

// Liste des assets de l'app shell. Chemins relatifs au scope du SW (./).
// Inclut les deux pages HTML : un seul SW sert les deux PWAs.
// Note : en local (serveur dev), ces fichiers s'appellent animation-centrales.html
// et animation-mobile.html. Sur GitHub Pages, ils sont renommes index.html et
// mobile.html par publier-public.ps1. Le SW pre-cache les noms publies ; en local
// le pre-cache echouera silencieusement (skipWaiting/install ne bloque pas) et
// chaque requete passera en cache-first opportuniste via le fetch handler.
const SHELL_ASSETS = [
  './',
  'index.html',
  'mobile.html',
  'manifest.webmanifest',
  'manifest-mobile.webmanifest',
  'assets/favicon-16.png',
  'assets/favicon-32.png',
  'assets/favicon-48.png',
  'assets/favicon-180.png',
  'assets/icon-full-192-any.png',
  'assets/icon-full-512-any.png',
  'assets/icon-full-192-maskable.png',
  'assets/icon-full-512-maskable.png',
  'assets/icon-mobile-192-any.png',
  'assets/icon-mobile-512-any.png',
  'assets/icon-mobile-192-maskable.png',
  'assets/icon-mobile-512-maskable.png',
  'assets/gestion-reservoir.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      // addAll est atomique : si UN fichier rate, tout echoue. On prefere une
      // boucle tolerante pour ne pas bloquer l'install si un asset manque.
      return Promise.all(
        SHELL_ASSETS.map((url) =>
          cache.add(url).catch(() => { /* ignore les 404 individuels */ })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

function isDataRequest(url) {
  // data/sommaire.json, data/manifest.json, data/AAAA-MM-horaire.json
  return /\/data\/[^/]+\.json(\?.*)?$/.test(url.pathname);
}

function isShellRequest(url) {
  if (url.pathname.endsWith('/')) return true;
  if (/\.html$/.test(url.pathname)) return true;
  if (/\.webmanifest$/.test(url.pathname)) return true;
  if (/\/assets\//.test(url.pathname)) return true;
  return false;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // On ne touche qu'au meme origine (GitHub Pages ou localhost).
  if (url.origin !== self.location.origin) return;

  if (isDataRequest(url)) {
    // Stale-while-revalidate.
    event.respondWith((async () => {
      const cache = await caches.open(DATA_CACHE);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })());
    return;
  }

  if (isShellRequest(url)) {
    // Cache-first avec fallback reseau + mise en cache opportuniste.
    event.respondWith((async () => {
      const cache = await caches.open(SHELL_CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) {
        // Hors-ligne et rien en cache : laisser le navigateur gerer l'erreur.
        throw e;
      }
    })());
  }
  // Sinon : passthrough reseau direct (pas de event.respondWith).
});
