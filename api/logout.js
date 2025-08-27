import cookie from "cookie";

export default async function handler(req, res) {
  // CORS handling
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET" || req.method === "POST") {
    // Clear the user cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("user", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0), // Expire immediately
      })
    );

    if (req.method === "GET") {
      // Redirect to login page
      res.writeHead(302, { Location: "/login" });
      res.end();
    } else {
      // Return JSON response
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
