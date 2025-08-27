import express from "express";
import { NeonDBService } from "../services/NeonDBService.ts";

export function createContentModelsRouter() {
  const router = express.Router();

  // (Optional) single content model endpoint can be added later

  // Fetch all content models
  router.get("/api/content-models", async (_req, res) => {
    try {
      const neon = NeonDBService.getInstance(process.env.DATABASE_URL!);
      const contentModels = await neon.getAllContentModels();
      return res.json({ contentModels });
    } catch (error) {
      console.error("Error fetching content model:", error);
      return res.status(500).json({ error: "Failed to fetch content model" });
    }
  });

  return router;
}


