import { TwitterApi } from 'twitter-api-v2';
import { withSession } from '../../lib/withSession.js';

export default withSession(async function handler(req, res) {
  const { oauth_token, oauth_verifier } = req.query;
  const tokenSecret = req.session.oauth_token_secret;

  if (!oauth_token || !oauth_verifier || !tokenSecret) {
    return res.status(400).send("Session oder Token fehlen");
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: oauth_token,
    accessSecret: tokenSecret,
  });

  const { client: loggedClient } = await client.login(oauth_verifier);

  await loggedClient.v1.updateAccountProfile({
    name: "GothAI Virus",
    description: "You have been gothified 🦇",
    url: "https://beacons.ai/gothaivirus",
    location: "GothNet",
  });

  res.send("Dein Profil wurde geändert 😈");
});
