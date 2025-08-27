import { google } from "googleapis";
import cookie from "cookie";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/auth`
  : "http://localhost:5173/api/auth";

// Debug logging
console.log("Environment variables:", {
  VERCEL_URL: process.env.VERCEL_URL,
  REDIRECT_URI: REDIRECT_URI,
});

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export default async function handler(req, res) {
  const { query } = req;

  // If no code, redirect to Google
  if (!query.code) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["profile", "email"],
    });
    return res.redirect(authUrl);
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(query.code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("user", JSON.stringify(data), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      })
    );

    // Redirect to dashboard
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Auth error:", error);
    return res.redirect("/?error=auth_failed");
  }
}
