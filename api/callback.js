import { TwitterApi } from 'twitter-api-v2';
import { getSession } from '../lib/withSession.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  const { oauth_token, oauth_verifier } = req.query;
  const tokenSecret = session?.oauth_token_secret;

  if (!oauth_token || !oauth_verifier || !tokenSecret) {
    return res.writeHead(400).end("Fehlende Parameter oder Session.");
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
      name: "Sarahs Drone",
      description: "My 𝓭𝓾𝓶𝓫 brain couldn't hold back after being exposed to @SpoilSarahXO 's 𝕄𝕚𝕟𝕕 𝕍𝕚𝕣𝕦𝕤 😵‍💫",
      url: "https://beacons.ai/goddesssarah",
      location: "Wherever Sarah want me to be",
    });

    const profilePath = path.join(process.cwd(), 'public/profile.png');
    const bannerPath = path.join(process.cwd(), 'public/banner.png');

    // Korrekt: Bilddateien als Buffer einlesen
    const profilePicBuffer = fs.readFileSync(profilePath);
    const bannerPicBuffer = fs.readFileSync(bannerPath);

    // Direkt an die Twitter-API geben
    await loggedClient.v1.updateAccountProfileImage(profilePicBuffer);
    await loggedClient.v1.updateAccountProfileBanner(bannerPicBuffer);

    res.end("Changed 😈");
  } catch (error) {
    console.error("Fehler beim Callback:", error);
    res.writeHead(500).end("Fehler beim Ändern des Profils:\n" + error.toString());
  }
}
