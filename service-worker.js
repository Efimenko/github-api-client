// var cacheName = 'v1';



// self.addEventListener('install', function(e) {
//     console.log('[ServiceWorker] Installed');
//     e.waitUntil(
// 	    caches.open(cacheName).then(function(cache) {
// 			return cache.addAll(cacheFiles);
// 	    })
// 	);
// });
//
//
// self.addEventListener('activate', function(e) {
//     e.waitUntil(
// 		caches.keys().then(function(cacheNames) {
// 			return Promise.all(cacheNames.map(function(thisCacheName) {
// 				if (thisCacheName !== cacheName) {
// 					return caches.delete(thisCacheName);
// 				}
// 			}));
// 		})
// 	);
// });
//
//
// self.addEventListener('fetch', function(e) {
// 	// console.log(e)
// 	if (e.request.url.search('localhost') === -1 &&  e.request.url.search('chrome-extension') === -1) {
// 		e.respondWith(
// 			caches.match(e.request)
// 				.then(function(response) {
// 					console.log(caches.open('v1'))
// 					if ( response ) {
// 						return response;
// 					}
// 					// var requestClone = e.request.clone();
// 					fetch(e.request)
// 						.then(function(response) {
//
// 							// var responseClone = response.clone();
// 							caches.open(cacheName).then(function(cache) {
// 								cache.put(e.request, response);
// 								return response;
// 					    })
// 						})
// 					})
// 		);
// 	}
// });

var CACHE = 'network-or-cache-v1';

var cacheFiles = [
	'./index.html',
	'./bundle.js',
	'./style.css'
]

// use 'addEventListener' instead of 'onMessage' syntax, it's javascript ninja recommandation
// self.addEventListener('install', function(evt) {
// 	evt.waitUntil(precache());
// })

// function precache() {
// 	return caches.open(CACHE) // Open a cache it's just key-value map system
// 		.then(function(cache){
// 			cache.addAll(cacheFiles);
// 		})
// }

self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.search('chrome-extension') === -1 &&
	event.request.url.search('bundle.js') === -1 &&
event.request.url.search('style.css') === -1) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(CACHE).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
