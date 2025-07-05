import express from 'express';
import fetch from 'node-fetch';
import querystring from 'querystring';
import fs from 'fs';

const router = express.Router();

const clientId = '';
const clientSecret = '';
const redirectUri = 'http://localhost:3000/callback';

router.get('/login', (req, res) => {
  const scope = 'user-read-playback-state user-modify-playback-state';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`;
  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log('🎫 Got callback code:', code);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();

  if (data.access_token && data.refresh_token) {
    fs.writeFileSync('./tokens.json', JSON.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token
    }, null, 2));

    console.log('✅ tokens.json saved');
    res.send('✅ Logged in & token saved – you can close this window');
  } else {
    console.error('❌ Failed to exchange code:', data);
    res.status(500).send('Login failed');
  }
});

export default router;
