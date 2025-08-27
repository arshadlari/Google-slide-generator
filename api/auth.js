import { google } from "googleapis";
import cookie from "cookie";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Handle different deployment environments
const getRedirectUri = () => {
  // Check for custom environment variable first
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }

  // Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/auth`;
  }

  // Local development
  return "http://localhost:3000/api/auth";
};

const REDIRECT_URI = getRedirectUri();

// Debug logging to help troubleshoot
console.log("OAuth Environment:", {
  VERCEL_URL: process.env.VERCEL_URL,
  NODE_ENV: process.env.NODE_ENV,
  REDIRECT_URI: REDIRECT_URI,
  CUSTOM_REDIRECT: process.env.GOOGLE_REDIRECT_URI,
});

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
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/presentations",
      ],
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

    // Store both user data and tokens
    const userData = {
      ...data,
      tokens: tokens,
    };

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("user", JSON.stringify(userData), {
        httpOnly: true,
        secure: true, // Always use secure in production
        sameSite: "lax", // Changed from "strict" to "lax" for better compatibility
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      })
    );
    res.writeHead(302, { Location: "/dashboard" });
    res.end();
    return;
  }

  // Step 3: Profile API
  if (query.profile) {
    console.log("Profile API called");
    console.log("Headers:", req.headers);
    console.log("Raw Cookie Header:", req.headers.cookie);

    const cookies = cookie.parse(req.headers.cookie || "");
    console.log("Parsed Cookies:", Object.keys(cookies));
    console.log("User Cookie Exists:", !!cookies.user);

    if (cookies.user) {
      try {
        const userData = JSON.parse(cookies.user);
        console.log("User data found:", {
          id: userData.id,
          name: userData.name,
        });
        res.status(200).json(userData);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        res.status(401).json({ error: "Invalid user data" });
      }
    } else {
      console.log("No user cookie found");
      res.status(401).json({ error: "Not authenticated" });
    }
    return;
  }
}
