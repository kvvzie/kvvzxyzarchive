import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import cors from 'cors';
import authRoutes from './auth.js';

const app = express();
app.use(cors());
app.use(express.json());

const clientId = '';
const clientSecret = '';

let tokens = {};

try {
  tokens = JSON.parse(fs.readFileSync('./tokens.json', 'utf8'));
  console.log('✅ tokens.json loaded');
} catch (e) {
  console.warn('⚠️ could not load tokens.json, starting without tokens');
}

async function refreshAccessToken() {
  if (!tokens.refresh_token) {
    console.warn('❌ No refresh_token, cannot refresh');
    return;
  }

  console.log('🔄 Refreshing access_token...');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token
    })
  });

  const data = await response.json();

  if (data.access_token) {
    tokens.access_token = data.access_token;
    if (data.refresh_token) {
      tokens.refresh_token = data.refresh_token;
      console.log('🔁 Got new refresh_token too');
    }

    fs.writeFileSync('./tokens.json', JSON.stringify(tokens, null, 2));
    console.log('✅ Token refreshed & saved');
  } else {
    console.error('❌ Failed to refresh token:', data);
  }
}

// refresh every 55 mins
setInterval(refreshAccessToken, 55 * 60 * 1000);
// start
refreshAccessToken();

app.get('/refresh', async (req, res) => {
  try {
    await refreshAccessToken();
    res.send('✅ Token ręcznie odświeżony');
  } catch (err) {
    console.error('❌ Błąd podczas ręcznego odświeżania tokena:', err);
    res.status(500).send('❌ Nie udało się odświeżyć tokena');
  }
});

app.get('/currently-playing', async (req, res) => {
  if (!tokens.access_token) {
    return res.status(401).json({ error: 'no access token' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    console.log(`❔[Spotify] Status: ${response.status}`);

    if (response.status === 204 || response.status > 400) {
      return res.json({ error: 'no track currently playing or error fetching data' });
    }

    const data = await response.json();
    res.json({
      trackId: data.item.id,
      trackName: data.item.name,
      artistName: data.item.artists.map(a => a.name).join(', '),
      albumCover: data.item.album.images[0].url,
      previewUrl: data.item.preview_url
    });
  } catch (err) {
    console.error('❌ Error while fetching track:', err);
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.use(authRoutes);
}

app.listen(3000, () => {
  console.log('🟢 Server running on http://localhost:3000/login');
});
