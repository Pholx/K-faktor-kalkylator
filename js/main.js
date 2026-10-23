document.addEventListener('DOMContentLoaded', () => {
  UI.init();

  // Registrera Service Worker för PWA (offline-stöd)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('Service Worker registrering misslyckades: ', err);
      });
    });
  }
});