
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "./sessionOptions.js";

export function withSession(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}
