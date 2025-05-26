export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "twitter_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  },
};
