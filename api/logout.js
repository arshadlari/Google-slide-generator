import cookie from "cookie";

export default function handler(req, res) {
  // Clear the user cookie
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("user", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
    })
  );

  // Redirect to home page
  return res.redirect("/");
}
