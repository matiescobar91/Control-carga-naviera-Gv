const V='cc-v3',F=['./','index.html','manifest.webmanifest','icon-192.png','icon-180.png','icon-512.png'];
// Instalación: guarda la app completa para usarla sin conexión (si un archivo falta, no bloquea el resto)
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// Abre al tiro desde el caché (funciona sin internet) y, si hay internet, actualiza el caché en segundo plano:
// una versión nueva de index.html queda lista para la próxima vez que se abra la app.
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET'||new URL(r.url).origin!=location.origin)return;
 e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  return (await net)||(await c.match('index.html'))||Response.error()}))});
