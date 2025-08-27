import { google } from "googleapis";
import cookie from "cookie";

export default async function handler(req, res) {
  // CORS handling
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Get user from cookie
  const cookies = cookie.parse(req.headers.cookie || "");
  if (!cookies.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userData = JSON.parse(cookies.user);
  const tokens = userData.tokens;

  if (!tokens) {
    return res.status(401).json({ error: "No authentication tokens" });
  }

  // Set up OAuth client with stored tokens
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials(tokens);

  const slides = google.slides({ version: "v1", auth: oauth2Client });

  try {
    if (req.method === "POST") {
      // Create a new presentation
      const { title } = req.body;

      const presentation = await slides.presentations.create({
        requestBody: {
          title: title || "Untitled Presentation",
        },
      });

      return res.status(200).json({
        presentationId: presentation.data.presentationId,
        title: presentation.data.title,
        url: `https://docs.google.com/presentation/d/${presentation.data.presentationId}/edit`,
      });
    }

    if (req.method === "GET") {
      // Get presentation details
      const { presentationId } = req.query;

      if (presentationId) {
        const presentation = await slides.presentations.get({
          presentationId: presentationId,
        });

        return res.status(200).json(presentation.data);
      } else {
        return res.status(400).json({ error: "Presentation ID required" });
      }
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Presentations API error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
