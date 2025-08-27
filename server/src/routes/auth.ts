import express, { type Request } from "express";
import type { DBService } from "../interfaces/DBService.ts";
import type { GoogleAuthService } from "../interfaces/GoogleAuthService.ts";

export function createAuthRouter(
  googleService: GoogleAuthService,
  dbService: DBService
) {
  const router = express.Router();

  // Step 1: Redirect user to Google
  router.get("/auth", async (req: Request, res) => {
    const userId = (req as any).session.userId;
    if (userId) res.redirect("http://localhost:5173/presentations");

    const forceConsent = req.query.force_consent === "true";
    const url = googleService.generateAuthUrl(forceConsent);
    res.redirect(url);
  });

  // Step 2: Google redirects here with code
  router.get("/api/auth/callback", async (req: Request, res) => {
    const code = (req.query as any).code as string;

    try {
      const userId = await googleService.handleOAuthCallback(code);
      (req as any).session.userId = userId;
      res.redirect("http://localhost:5173/presentations");
    } catch (err: any) {
      console.error("OAuth callback error:", err);

      if (err.message === "MISSING_REFRESH_TOKEN") {
        console.log(
          "New user missing refresh token, redirecting to consent flow"
        );
        return res.redirect("/auth?force_consent=true");
      }

      res.status(500).send("Authentication failed");
    }
  });

  router.get("/logout", (req: Request, res) => {
    (req as any).session.destroy(() => {
      res.json({ url: "/login" });
    });
  });

  router.get("/auth/status", async (req: Request, res) => {
    if ((req as any).session.userId) {
      try {
        const userToken = await dbService.getUserToken(
          (req as any).session.userId
        );
        if (userToken) {
          res.json({
            loggedIn: true,
            userId: (req as any).session.userId,
            userInfo: {
              name: userToken.user_name,
              email: userToken.user_email,
            },
          });
        } else {
          res.json({ loggedIn: false });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        res.json({ loggedIn: false });
      }
    } else {
      res.json({ loggedIn: false });
    }
  });

  return router;
}
