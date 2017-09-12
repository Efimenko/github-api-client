var CACHE = 'network-or-cache-v1';

// var cacheFiles = [
// 	'./index.html',
// 	'./bundle.js',
// 	'./style.css'
// ]
//
// self.addEventListener('install', function(evt) {
// 	evt.waitUntil(precache());
// })
//
// function precache() {
// 	return caches.open(CACHE)
// 		.then(function(cache){
// 			cache.addAll(cacheFiles);
// 		})
// }

self.addEventListener('fetch', event => {
  if (event.request.url.search('chrome-extension') === -1) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(CACHE).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
