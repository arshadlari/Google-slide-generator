import { google } from "googleapis";
import cookie from "cookie";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/auth`
  : "http://localhost:5173/api/auth";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export default async function handler(req, res) {
  const { query } = req;

  // Step 1: Redirect user to Google login
  if (!query.code && !query.profile) {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["profile", "email"],
    });
    res.writeHead(302, { Location: url });
    res.end();
    return;
  }

  // Step 2: Handle OAuth callback
  if (query.code) {
    const { tokens } = await oauth2Client.getToken(query.code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("user", JSON.stringify(data), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60,
      })
    );
    res.writeHead(302, { Location: "/dashboard" });
    res.end();
    return;
  }

  // Step 3: Profile API
  if (query.profile) {
    const cookies = cookie.parse(req.headers.cookie || "");
    if (cookies.user) {
      res.status(200).json(JSON.parse(cookies.user));
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  }
}
