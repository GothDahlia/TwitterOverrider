import { TwitterApi } from 'twitter-api-v2';
import { withSession } from '../../lib/withSession.js';

export default withSession(async function handler(req, res) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
  });

  const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(
    process.env.CALLBACK_URL
  );

  req.session.oauth_token_secret = oauth_token_secret;
  await req.session.save();

  res.redirect(url);
});
