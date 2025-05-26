import { TwitterApi } from 'twitter-api-v2';
import { getSession } from '../lib/withSession.js';

export default async function handler(req, res) {
  const session = await getSession(req, res);

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
  });

  const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(
    process.env.CALLBACK_URL
  );

  session.oauth_token_secret = oauth_token_secret;
  await session.save();

  res.writeHead(302, { Location: url });
  res.end();
}
