// console.log("service worker test working") 
const CACHE_NAME= "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "./index.html",
  "./css/styles.css",
  "./js/index.js",
  "./js/idb.js",
  "./manifest.json",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png",
];

// Fetch
self.addEventListener('fetch', function (evt) {
  // console.log('fetch request : ' + evt.request.url)
  if (evt.request.url.includes("/api/")){
  evt.respondWith(
    caches.open(DATA_CACHE_NAME).then( cache => {
        
            const response =  fetch(evt.request);
            if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
            }
            return response;})
       .catch (err => {
            return cache.match(evt.request);
        
      }).catch(err =>console.log(err))
  );
  return;
    }
evt.respondWith(
    fetch(evt.request).catch(function(){
        return caches.match(evt.request)
        .then(function(response){
            if(response){
                return response;
            }else if(evt.request.headers.get("accept").includes("text/html")){
                return caches.match("/");
            }
        });
    })
)
  });

  



// Installing 
self.addEventListener('install', function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  );
  self.skipWaiting();
});

// Delete outdated caches/activate
self.addEventListener('activate', function (evt) {
  evt.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key ) {
        if (key !== CACHE_NAME &&  key !== DATA_CACHE_NAME) {
          console.log('deleting cache : ' , key );
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

