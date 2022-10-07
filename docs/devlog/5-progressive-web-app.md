# Creating a Progressive Web App (DEV LOG 5)

October 6

Since all the work is done on the frontend, I can allow using the site offline. Even if they don't install the app to their home screen, going to the url offline will still work using cached files. When installed and online it will use the network to get files. The cache is only used when offline. 

## Service Worker 

- https://web.dev/offline-fallback-page

### install Event

Runs the first time the service worker gets setup (not when they press the install button). 

triggered by incrementing the magic variable `OFFLINE_VERSION`.

defines which files should be cached for offline use. The `{ cache: "reload" }` tells it to skip the HTTP cache. 
 

```javascript
event.waitUntil(
    (async () => {
        let cache = await caches.open(CACHE_NAME);
        for (let path of files){
            await cache.add(new Request(path, { cache: "reload" }));
        }
    })()
);
self.skipWaiting();
```

### fetch Event

triggered whenever one of the site's files is fetched 

wrap the `fetch` call so if we get an error (because they're offline), we can return the file from the cache instead. 

```javascript
event.respondWith(
    (async () => {
        try {
            return await fetch(event.request);
        } catch (error) {
            const cache = await caches.open(CACHE_NAME);
            return await cache.match(event.request);
        }
    })()
);
```

### Scope Problem

The path of the provided scope ('/') is not under the max scope allowed ('/pwa/'). Adjust the scope, move the Service Worker script, or use the Service-Worker-Allowed HTTP header to allow the scope.

wanted to put it in /pwa but then it cant apply to whole site

### Dealing with Cloudflare Redirects

Cloudflare pages forces the following redirects: `/index.html -> /` and `/anything.html -> /anything`. So when I tell it to cache `/index.html`, I can't load it offline because it puts me at `/` and it can't find that in the cache. I can't even manually navigate to `/index.html` offline because it caches the 301. Maybe I could have it cache `/` to reference the root, I'm not sure. My solution was to move the app to `/circuit.html` and tell the service worker to cache `/circuit`. This also opens up the potential for a landing page which I will want at some point anyway. 

## Manifest 

- https://web.dev/add-manifest

The manifest is a json file that provides some metadata about the app and is referenced by an HTML tag.

```html
<link rel="manifest" href="/app.webmanifest"/>
```

The install button in chrome won't show up unless you have all of these fields defined (including specific icon sizes). The `display` field tells it what extra ui elements from the browser to show when the installed app is opened. 

```
- name
- start_url
- display: "standalone" | "browser" | "minimal-ul"
- description
- background_color: "#123456"
- icons[]
    - src
    - type: "image/png"
    - sizes: "192x192" and "512x512" are required
```

## In Site Install Button

- https://web.dev/customize-install

Listen for event that tells us we're aloud to install then show button. On click as browser to show the install dialogue popup. Now I can have a button in the UI that only shows up if not already installed instead of relying on people knowing to click the icon in the address bar. 

```javascript
window.addEventListener('beforeinstallprompt', (e) => {
    installPromptEvent = e;
    installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
    installButton.hidden = true;
    installPromptEvent.prompt();
    let result = await installPromptEvent.userChoice;
    installPromptEvent = undefined;
});
```

## File Handling 

TODO: https://web.dev/learn/pwa/os-integration/#file-handling https://web.dev/file-handling/