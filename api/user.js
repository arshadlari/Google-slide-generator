import cookie from "cookie";

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");

  if (cookies.user) {
    try {
      const userData = JSON.parse(cookies.user);
      return res.status(200).json(userData);
    } catch (error) {
      return res.status(401).json({ error: "Invalid user data" });
    }
  }

  return res.status(401).json({ error: "Not authenticated" });
}
