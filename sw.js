const STATIC_DATA = [
  'index.html',
	'addusage.html',
  '/assets/bootstrap/css/bootstrap.min.css',
	'/assets/js/theme.js',
  'addusagelib.js',
  'clientlib.js',
	'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
	'https://cdn.jsdelivr.net/gh/yukik/koyomi/public/koyomi.min.js',
	'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
	'assets/style.css',
	'https://www.gstatic.com/firebasejs/7.2.3/firebase-firestore.js',
	'https://www.gstatic.com/firebasejs/7.2.3/firebase-app.js',
	'https://www.gstatic.com/firebasejs/7.2.3/firebase-analytics.js',
	'https://cdn.jsdelivr.net/npm/toastify-js',
	'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.js',
	'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js'
];

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('cache_v1').then(function(cache) {
     return cache.addAll(STATIC_DATA);
   })
 );
});

self.addEventListener('fetch', function(event) {
 console.log(event.request.url);

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});
