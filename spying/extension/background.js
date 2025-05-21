chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.currentVideoId) {
      const videoId = changes.currentVideoId.newValue;
      fetch('https://kvvz.xyz/currently-watching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoId }),
        mode: 'cors'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  });
  