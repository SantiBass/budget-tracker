// console.log("service worker test working") 
// const CACHE_NAME= "static-cache-v2";
// const DATA_CACHE_NAME = "data-cache-v1";
// const FILES_TO_CACHE = [
//   "/",
//   "./index.html",
//   "./styles.css",
//   ".js/index.js",
//   "./icons/icon-96x96.png",
//   "./icons/icon-144x144.png"
// ];

// // Fetch
// self.addEventListener('fetch', function (evt) {
//   console.log('fetch request : ' + evt.request.url)
//   if (evt.request.url.includes("/api/"))
//   evt.respondWith(
//     caches.open(DATA_CACHE_NAME).then(async cache => {
//         try {
//             const response = await fetch(evt.request);
//             if (response.status === 200) {
//                 cache.put(evt.request.url, response.clone());
//             }
//             return response;
//         } catch (err) {
//             return await cache.match(evt.request);
//         }
//       }).catch(err =>console.log(err))
//   );
//   return;

// evt.respondWith(
//     fetch(evt.request).catch(function(){
//         return caches.match(evt.request)
//         .then(function(response){
//             if(response){
//                 return response;
//             }else if(evt.request.headers.get("accept").includes("text/html")){
//                 return caches.match("/");
//             }
//         });
//     })

//     );

// });



// // Installing 
// self.addEventListener('install', function (evt) {
//   evt.waitUntil(
//     caches.open(CACHE_NAME).then(function (cache) {
//       console.log('installing cache : ' + CACHE_NAME)
//       return cache.addAll(FILES_TO_CACHE)
//     })
//   );
//   self.skipWaiting();
// });

// // Delete outdated caches/activate
// self.addEventListener('activate', function (evt) {
//   evt.waitUntil(
//     caches.keys().then(function (keyList) {
//       return Promise.all(keyList.map(function (key ) {
//         if (key !== CACHE_NAME &&  key !== DATA_CACHE_NAME) {
//           console.log('deleting cache : ' , key );
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
//   self.clients.claim();
// });


const CACHE_NAME = 'my-site-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v2';

const FILES_TO_CACHE = [
    "/",
      "./index.html",
      "./styles.css",
      ".js/index.js",
      "./icons/icon-96x96.png",
      "./icons/icon-144x144.png"
];

// Install the service worker
self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Your files were pre-cached successfully!');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// Activate the service worker and remove old data from the cache
self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Removing old cache data', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Intercept fetch requests
self.addEventListener('fetch', function(evt) {
  if (evt.request.url.includes('/api/')) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }

              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        })
        .catch(err => console.log(err))
    );

    return;
  }

  evt.respondWith(
    fetch(evt.request).catch(function() {
      return caches.match(evt.request).then(function(response) {
        if (response) {
          return response;
        } else if (evt.request.headers.get('accept').includes('text/html')) {
          // return the cached home page for all requests for html pages
          return caches.match('/');
        }
      });
    })
  );
});
