setInterval(() => {
    const videoId = new URLSearchParams(window.location.search).get('v');
    if (videoId) {
      chrome.storage.local.set({ currentVideoId: videoId });
    }
  }, 5000); // Sprawdza co 5 sekund
