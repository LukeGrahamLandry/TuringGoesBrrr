export function initProgressiveWebApp(){
    initServiceWorker();
    initInstallButton();
}

function initServiceWorker(){
    window.addEventListener("load", () => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/service-worker.js", {scope: '/'});
        }
    });
}

let installButton = document.getElementById("installPWA");
let installPromptEvent;

function initInstallButton(){
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
}