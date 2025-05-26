import { sessionOptions } from './sessionOptions.js';
import { getIronSession } from 'iron-session';

export async function getSession(req, res) {
  return getIronSession(req, res, sessionOptions);
}
