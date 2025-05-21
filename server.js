import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const accessToken = '';

let currentYouTubeVideoId = null;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get('/currently-playing', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('Spotify API response status:', response.status);

    if (response.status === 204 || response.status > 400) {
      console.log('No track currently playing or error fetching data');
      return res.json({ error: 'No track currently playing or error fetching data' });
    }

    const data = await response.json();
    console.log('Raw data from Spotify:', JSON.stringify(data, null, 2));

    const trackInfo = {
      trackId: data.item.id,
      trackName: data.item.name,
      artistName: data.item.artists.map(artist => artist.name).join(', '),
      albumCover: data.item.album.images[0].url,
      previewUrl: data.item.preview_url
    };

    console.log('Formatted track info:', trackInfo);
    res.json(trackInfo);
  } catch (error) {
    console.error('Error fetching currently playing track:', error);
    res.status(500).json({ error: 'Failed to fetch currently playing track' });
  }
});

app.post('/currently-watching', (req, res) => {
  currentYouTubeVideoId = req.body.videoId;
  console.log('Received YouTube video ID:', currentYouTubeVideoId);
  res.sendStatus(200);
});

app.get('/currently-watching', (req, res) => {
  if (currentYouTubeVideoId) {
    res.json({ videoId: currentYouTubeVideoId });
  } else {
    res.json({ message: 'No video currently being watched' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
