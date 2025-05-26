import { TwitterApi } from 'twitter-api-v2';
import { getSession } from '../lib/withSession.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  const { oauth_token, oauth_verifier } = req.query;
  const tokenSecret = session.oauth_token_secret;

  if (!oauth_token || !oauth_verifier || !tokenSecret) {
    res.writeHead(400).end("Fehlende Parameter oder Session.");
    return;
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: oauth_token,
    accessSecret: tokenSecret,
  });

  const { client: loggedClient } = await client.login(oauth_verifier);

  await loggedClient.v1.updateAccountProfile({
    name: "GothAIs Drone",
    description: "My 𝓭𝓾𝓶𝓫 brain couldn't hold back after being exposed to @GothAIVirus 's 𝕄𝕚𝕟𝕕 𝕍𝕚𝕣𝕦𝕤 😵‍💫",
    url: "https://beacons.ai/gothaivirus",
    location: "Wherever Goths want me to be",
  });

  const profilePic = fs.readFileSync(path.resolve('./public/profile.jpg'), 'base64');
  await loggedClient.v1.updateAccountProfileImage(profilePic);

  const bannerPic = fs.readFileSync(path.resolve('./public/banner.jpg'), 'base64');
  await loggedClient.v1.updateAccountProfileBanner(bannerPic);

  res.end("😈");
}