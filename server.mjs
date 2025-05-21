import express from 'express';
import fetch from 'node-fetch';
import querystring from 'querystring';

const app = express();
const clientId = '';
const clientSecret = '';
const redirectUri = 'http://localhost:3000/callback';

app.get('/login', (req, res) => {
    const scope = 'user-read-playback-state user-modify-playback-state';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`;
    res.redirect(authUrl);
  });
  
  app.get('/callback', async (req, res) => {
    const code = req.query.code;
  
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
    const accessToken = data.access_token;
  
    res.send(`Access Token: ${accessToken}`);
  });
  
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    console.log('Go to http://localhost:3000/login to authenticate');
  });