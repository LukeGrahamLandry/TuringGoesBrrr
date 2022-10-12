# Creating a Progressive Web App 

October 6

Since all the work is done on the frontend, I can allow using the site offline. Even if they don't install the app to their home screen, going to the url offline will still work using cached files. When installed and online it will use the network to get files. The cache is only used when offline. 

## Service Worker 

- https://web.dev/offline-fallback-page

### load Event

Fires on the main thread when the page is loaded and lets you register a JavaScript file to be run in the background as a service worker. 

```javascript
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js", {scope: '/'});
}
```
### install Event

Fires on the worker's thread the first time the service worker gets setup (not when they press the install button). 

defines which files should be cached for offline use. The `{ cache: "reload" }` tells it to skip the HTTP cache to make sure it gets the update from the network. I feel like it could still be cached by cloudflare so perhaps it doesn't really achieve anything. 

The `skipWaiting` call makes forces this version the active service worker for any open pages. If I didn't want to do this I'd also have to change the cache name based on the version because currently loading a new service worker rewrites those files. Might be better to keep that separation so they can't accidentally load js from the wrong version but then I worry about leaving a trail of caches taking up their space. 
 

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

Problem: if it fails to fetch any one of the new files, it discards all of them

### fetch Event

Fires on the worker's thread whenever one of the site's files is fetched 

wrap the `fetch` call so if we get an error (because they're offline), we can return the file from the cache instead. 


The `catch` block is only called if an exception is thrown (ex. a network error). If the request gets an HTTP code that indicates an error (ex. 4xx or 5xx), the `catch` block is NOT called. 

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

I also flip it so it checks the cache first instead of the network since if anything changed the worker will already have fetched the updated version. Told cloudflare not to cache js files. Consider adding the content hash to the js file names to make sure it doesn't get stored in the http cache.

### Scope Problem

Wanted to put the worker script in` /pwa/service-worker.js` but then it cant apply to whole site so moved it to `/service-worker.js`.

The path of the provided scope ('/') is not under the max scope allowed ('/pwa/'). Adjust the scope, move the Service Worker script, or use the Service-Worker-Allowed HTTP header to allow the scope.

### Dealing with Cloudflare Redirects

Cloudflare pages forces the following redirects: `/index.html -> /` and `/anything.html -> /anything`. So when I tell it to cache `/index.html`, I can't load it offline because it puts me at `/` and it can't find that in the cache. I can't even manually navigate to `/index.html` offline because it caches the 301. My solution was to move the app to `/circuit.html` and tell the service worker to cache `/circuit`. I could probably have it cache `/` to reference the root but moving the page also opens up the potential for a landing page which I will want at some point anyway. 

### Updating 

- https://web.dev/service-worker-lifecycle

Any change to the service worker script will cause the browser to create a new worker and fire the install event again. So in my build script I append the commit hash to `service-worker.js` so everyone will fetch the new files every time I make a change. 

### Support Preloading Content

- https://web.dev/navigation-preload

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