import { TwitterApi } from 'twitter-api-v2';
import { getSession } from '../lib/withSession.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  const { oauth_token, oauth_verifier } = req.query;
  const tokenSecret = session?.oauth_token_secret;

  if (!oauth_token || !oauth_verifier || !tokenSecret) {
    console.error("Fehlende Parameter oder Session", {
      token: oauth_token,
      verifier: oauth_verifier,
      tokenSecret,
    });
    res.writeHead(400).end("Fehlende Parameter oder Session.");
    return;
  }

  try {
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

const profilePath = path.join(process.cwd(), 'public/profile.jpg');
    const bannerPath = path.join(process.cwd(), 'public/banner.jpg');

    console.log("Prüfe Dateien...");
    console.log("Profile existiert:", fs.existsSync(profilePath));
    console.log("Banner existiert:", fs.existsSync(bannerPath));

    const profilePic = fs.readFileSync(profilePath, { encoding: 'base64' });
    const bannerPic = fs.readFileSync(bannerPath, { encoding: 'base64' });

    await loggedClient.v1.updateAccountProfileImage(profilePic);
    await loggedClient.v1.updateAccountProfileBanner(bannerPic);

    res.end("😈");
  } catch (error) {
    console.error("Fehler beim Callback:", error);
    res.writeHead(500).end("Fehler beim Ändern des Profils.");
  }
}